import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthComtext";
import axios from "axios";
import "./UserGroupsList.css";
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
import CreateGroup from "./CreateGroup";

const UserGroupsList = () => {
  const {
    user,
    selectedGroup,
    setSelectedGroup,
    groups,
    setGroups,
    showChat,
    setShowChat,
    setIsGroupAdmin,
    IsGroupAdmin,
    setNotification,
    notification,
    setGroupSenders,
    muteGroup,
    setMuteGroup,
    setShowUserChat
  } = useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestMessage, setLatestMessage] = useState();
  const [openedGroup, setOpenedGroup] = useState("");
  const userData = JSON.parse(localStorage.getItem("user")); //get the user  info of current logged in user
  const userId = userData._id;
  const [mutedGroups, setMutedGroups] = useState([]);

  useEffect(() => {
    getUserGroups();



  }, [groups]);

  useEffect(() => {


      // Fetch IsGroupMuted for each group and update the mutedGroups state
      const fetchMutedStatus = async () => {
        const mutedStatusPromises = groups.map((group) =>
          IsGroupMuted(group._id)
        );
        const mutedStatuses = await Promise.all(mutedStatusPromises);
        setMutedGroups(mutedStatuses);
      };
  
      fetchMutedStatus(); // Fetch the muted status after user groups are f
  }, []);


  useEffect(() => {
        // Fetch IsGroupMuted for each group and update the mutedGroups state
        const fetchMutedStatus = async () => {
          const mutedStatusPromises = groups.map((group) =>
            IsGroupMuted(group._id)
          );
          const mutedStatuses = await Promise.all(mutedStatusPromises);
          setMutedGroups(mutedStatuses);
        };
    
        fetchMutedStatus(); // Fetch the muted status when component mounts or groups change

  },[muteGroup]);


  //get all the user groups from db and store them on groups
  const getUserGroups = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/UserGroupList",
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          params: { userId },
        }
      );
      // console.log(response.data);
      setGroups(response.data);
    } catch (error) {
      throw error;
    }
  };

  /*
  //set the group data in the local storage
  const openGroup = (groupId, groupName,groupUsers) => {
    
    localStorage.setItem(
      "group",
      JSON.stringify({ groupId: groupId, groupName: groupName, users: groupUsers })
    );
  };*/

  //unfollow group
  const unfollorGroup = async (groupId) => {
    setShowChat(false);
    const response = await axios.post(
      "http://localhost:3001/api/v1//UnfollowGroup",
      { groupId, userId }
    );
  };

  const getGroupSenders = async (groupId) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1//getGroupSenders",
      { groupId }
    );
    setGroupSenders(response.data);
  };

  //check if group muted
  const IsGroupMuted = async (groupId) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1//checkUserExistInMute",
      { groupId, userId }
    );

    //setMuteGroup(response.data);
    return response.data;
  };

  /*
  //get the latest message
  const getLatestMessage = () =>{
    const response=axios.get('http://localhost:3001/api/v1/getLatestMessage',{groupId})
    if(response){
      setLatestMessage(response.data.latestMessage);
    }

  };*/

  return (
    <div className="myGroups_box">
      <div className="myGroups-head">

          <h3 className="groupTitle">My Groups</h3>

          <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="#b8b4da">
              <ModalCloseButton />
              <ModalBody>
                <CreateGroup></CreateGroup>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Button onClick={onOpen} className="ceateGroup-button">
            Create New Group
          </Button>

      </div>

      <br />
      <VStack className="groups" spacing={2} align="stretch" overflowY="auto">
        {groups.map((group, index) => (
          <Box>
            <Box
              className="groupBox"
              p={4}
              key={group._id}
              onClick={async () => {
                await setSelectedGroup(group);
                console.log('selectedGroup: ', selectedGroup);
                const IsMuted = await IsGroupMuted(group._id);
                setMuteGroup(IsMuted);
                setShowUserChat(false);
                setShowChat(true);
                getGroupSenders(group._id);
                

              }}
            >
              <div className="groupNameAndIcon">
                <strong>{group.groupName}</strong>
                {mutedGroups[index] && (
                  <span class="material-symbols-outlined">volume_off</span>
                )}
              </div>
              <p>Last Message: {group.latestMessage} </p>
              <p className="sendingTime">{group.latestMessageTime}</p>
            </Box>
            <div className="footer">
              <button
                className="delete_button"
                onClick={() => {
                  unfollorGroup(group._id);
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

export default UserGroupsList;
