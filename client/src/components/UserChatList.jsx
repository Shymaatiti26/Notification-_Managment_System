import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthComtext";
import axios from "axios";
import "./UserChatList.css";
import {
  HStack,
  VStack,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

//import CreateGroup from "./CreateGroup";////

const UserChatList = () => {
  const {
    user,
    selectedUser,
    setSelectedUser,
    users,
    setUsers,
    showChat,
    setShowChat,
    setAdmin,
    IsAdmin,
    setNotification,
    notification,
    setUsersSenders,
    userSenders,
    muteUser,
    setMuteUser,
    showUserChat,
    setShowUserChat,
  } = useAuthContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestMessage, setLatestMessage] = useState();
  const [openedUserChat, setOpenedUserChat] = useState("");
  const userData = JSON.parse(localStorage.getItem("user")); //get the user  info of current logged in user
  const adminId = userData._id;
  const [mutedChats, setMutedChats] = useState([]);

  useEffect(() => {
   // getFollowedUsers();
  }, [users]);

  useEffect(()=>{
    getFollowedUsers();
  });
  ////////////////////////////////////////////////////
  useEffect(() => {
    // Fetch IsGroupMuted for each group and update the mutedGroups state
    const fetchMutedStatus = async () => {
      const mutedStatusPromises = users.map((user) => IsGroupMuted(user._id));
      const mutedStatuses = await Promise.all(mutedStatusPromises);
      setMutedChats(mutedStatuses);
    };

    fetchMutedStatus(); // Fetch the muted status after user groups are f
  }, []);
  /*
useEffect(() => {
  // Fetch IsGroupMuted for each group and update the mutedGroups state
  const fetchMutedStatus = async () => {
    const mutedStatusPromises = users.map((user) =>
      IsGroupMuted(user._id)
    );
    const mutedStatuses = await Promise.all(mutedStatusPromises);
    setMutedChats(mutedStatuses);
  };

  fetchMutedStatus(); // Fetch the muted status when component mounts or groups change

},[muteUser]);
*/
  /////////////////////////////////////////////
  //get all the followedusers from db and store them on users
  const getFollowedUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/followedUsersList",
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          params: { adminId },
        }
      );
      // console.log(response.data);
      setUsers(response.data);
      console.log(users);
    } catch (error) {
      throw error;
    }
  };

  //unfollow user chat
  //    const unfollowrUser = async (userId) => {
  //       setShowUserChat(false);
  //    const response = await axios.put(
  //     "http://localhost:3001/api/v1/UnfollowUser",
  //   { adminId,userId}

  //   );
  // };

  const IsGroupMuted = async (adminId) => {
    const response = await axios.get(
      "http://localhost:3001/api/v1//checkUserExistInMute1",
      { adminId, userId }
    );

    //setMuteGroup(response.data);
    return response.data;
  };

  return (
    <div className="myGroups_box">
      <div className="myUserss-head" >
        <h3 className="groupTitle">Users</h3>
      </div>

      <VStack
        className="groups"
        style={{ backgroundColor: "white" }}
        spacing={2}
        align="stretch"
        overflowY="auto"
      >
        {users.map((admin, index) => (
          <Box>
            <Box
              className="userBox"
              style={{ padding: "20px" }}
              p={4}
              key={admin._id}
              onClick={async () => {
                setSelectedUser(admin);
                //const IsMuted = await IsGroupMuted(admin._id);
                // setMuteUser(IsMuted);
                setShowChat(false);
                setShowUserChat(true);
                //getGroupSenders(admin._id);
              }}
            >
              <div className="userNameAndIcon" style={{ padding: "15px" }}>
                <strong>{admin.username}</strong>
                {mutedChats[index] && (
                  <span class="material-symbols-outlined"> volume_off</span>
                )}
              </div>
              <p>Last Message: {admin.latestMessage} </p>
              <p className="sendingTime">{admin.latestMessageTime}</p>
            </Box>
            {/* <div className="footer">
              <button
                className="delete_button"
                onClick={() => {
                    unfollowrUser(admin._id);
                }}
              >
                Unfollow
              </button>
            </div> */}
          </Box>
        ))}
      </VStack>
    </div>
  );
};

export default UserChatList;
