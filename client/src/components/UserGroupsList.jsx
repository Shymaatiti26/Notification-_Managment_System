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
  const { user, selectedGroup, setSelectedGroup, groups, setGroups,showChat,setShowChat } =
    useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestMessage, setLatestMessage] = useState();
  const [openedGroup, setOpenedGroup] = useState("");
  const userData = JSON.parse(localStorage.getItem("user")); //get the user  info of current logged in user
  const userId = userData._id;
  


  useEffect(() => {
    getUserGroups();
   // console.log(user1);
    //console.log(user1._id);
    //getLatestMessage();
  }, [groups]);

  /*
  useEffect(() => {
    localStorage.setItem(
      "group",
      JSON.stringify({ groupId: openedGroup._id, groupName: openedGroup.groupName, users: openedGroup.users })
    );
    //getLatestMessage();
  },[openedGroup]);
*/

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
      console.log(response.data);
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
    setShowChat(false)
    const response = await axios.post(
      "http://localhost:3001/api/v1//UnfollowGroup",
      { groupId ,userId},
    );
    
  };

  const IsUsergroupAdmin=(group)=>{
    if(user.username==group.groupAdmin){
      return  true;
    }else{
      return false;
    }
  }

  

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
        <HStack>
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
        </HStack>
      </div>

      <br />
      <VStack className="groups" spacing={2} align="stretch" overflowY="auto">
        {groups.map((group) => (
          <Box>
          <Box
            className="groupBox"
            p={4}
            key={group._id}
            onClick={() => {
              setSelectedGroup(group);
              setShowChat(true);
            }}
          >
            <strong>{group.groupName}</strong>
            <p>Last Message: {group.latestMessage} </p>
            <p className="sendingTime">{group.latestMessageTime}</p>

          </Box>           
           <div className="footer">
              <button
                className="delete_button"
                onClick={() => unfollorGroup(group._id)}
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
