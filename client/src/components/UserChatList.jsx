import React,{useState, useEffect} from "react";
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
      } = useAuthContext();

      const { isOpen, onOpen, onClose } = useDisclosure();
      const [latestMessage, setLatestMessage] = useState();
      const [openedUserChat, setOpenedUserChat] = useState("");
      const userData = JSON.parse(localStorage.getItem("user")); //get the user  info of current logged in user
      const adminId = userData._id;
      const [mutedChats, setMutedChats] = useState([]);

      useEffect(() => {
        getFollowedUsers();
    
      }, [users]);

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
       const unfollowrUser = async (userId) => {
          setShowChat(false);
       const response = await axios.put(
        "http://localhost:3001/api/v1/UnfollowUser",
      { adminId,userId}

      );
    };

    

      return (
    <div>
      <VStack className="groups" spacing={2} align="stretch" overflowY="auto">
        {users.map((admin, index) => (
          <Box>
            <Box
              className="userBox"
              p={4}
              key={admin._id}
              onClick={async () => {
                setSelectedUser(user);
                //const IsMuted = await IsGroupMuted(admin._id);
                //setMuteUser(IsMuted);
                setShowChat(true);
                //getGroupSenders(admin._id);
              }}
            >
              { <div className="userNameAndIcon">
                <strong>{admin.username}</strong>
                {/* {muteUser[index] && (
                  <span class="material-symbols-outlined">volume_off</span>
                )} */}
              </div>}
              {/* <p>Last Message: {admin.latestMessage} </p>
              <p className="sendingTime">{admin.latestMessageTime}</p> */}
            </Box>
            <div className="footer">
              <button
                className="delete_button"
                onClick={() => {
                    unfollowrUser(admin._id);
                }}
              >
                Unfollow
              </button>
            </div>
          </Box>
        ))}
      </VStack>
    </div>
  );
};

export default UserChatList;


