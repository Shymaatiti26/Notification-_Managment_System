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
  const { user } = useAuthContext();
  //const [groups, setGroups] = useState([{groupName:"jnm"}, {groupName:"jnm",lastMessage:"hbjhn"}, {groupName:"jnm",lastMessage:"hbjhn"}]);
  const [groups, setGroups] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [latestMessage,setLatestMessage] = useState();
  


  useEffect(() => {
    getUserGroups();
    //getLatestMessage();
  }, []);

  //get all the user groups from db and store them on groups
  const getUserGroups = async () => {
    try {
      //const response = await axios.post('http://localhost:3001/api/v1/UserGroupList',user.data._id)
      //setGroups(response.data.users)
      const response = await axios.get(
        "http://localhost:3001/api/v1/UserGroupList"
      );
      console.log(response.data);
      setGroups(response.data);
    } catch (error) {
      throw error;
    }
  };

  //set the group data in the local storage
  const openGroup = (groupId, groupName) => {
    console.log(groupId);
    localStorage.setItem(
      "group",
      JSON.stringify({ groupId: groupId, groupName: groupName })
    );
    location.reload();
  };

  //delete Group 
  const deleteGroup=(groupId)=>{
    const response=axios.post('http://localhost:3001/api/v1/deleteGroup',{groupId})
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
            onClick={() => openGroup(group._id, group.groupName)}
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
