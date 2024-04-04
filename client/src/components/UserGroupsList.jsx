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
  const { user,selectedGroup, setSelectedGroup,groups, setGroups } = useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestMessage,setLatestMessage] = useState();
  const [openedGroup, setOpenedGroup] = useState('');
  


  useEffect(() => {
    //getUserGroups();
    //getLatestMessage();
  },[groups]);

  useEffect(() => {
    getUserGroups();
    //getLatestMessage();
  });
  
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
      console.log("hhh",user)
      //const userId = user._id;
      //const response = await axios.get('http://localhost:3001/api/v1/UserGroupList',{userId})
      //setGroups(response.data.users)
      const response = await axios.get("http://localhost:3001/api/v1/UserGroupList");
      console.log(response.data);
      setGroups(response.data)
      

    } catch (error) {
      throw error;
    }
  };

  //set the group data in the local storage
  const openGroup = (groupId, groupName,groupUsers) => {
    
    localStorage.setItem(
      "group",
      JSON.stringify({ groupId: groupId, groupName: groupName, users: groupUsers })
    );
  };

  //delete Group 
  const deleteGroup=(groupId)=>{
    const response=axios.post('http://localhost:3001/api/v1/deleteGroup',{groupId})
    location.reload()
    
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
        <HStack>
          <h3 className="groupTitle">My Groups</h3>

          <Modal isOpen={isOpen} onClose={onClose}>
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
          <Box
            className="groupBox"
            p={4}
            key={group._id}
            onClick={() => {setSelectedGroup(group)}}
          >
            <strong>{group.groupName}</strong>
            <p>Last Message: {group.latestMessage}</p>
            <div className="footer">
            <button className="delete_button" onClick={()=>deleteGroup(group._id)}>Delete</button>
            </div>
          </Box>
        ))}
      </VStack>
    </div>
  );
};

export default UserGroupsList;
