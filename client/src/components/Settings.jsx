import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthComtext";
import { Switch } from "@chakra-ui/react";
import "./Settings.css";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  VStack,
  Box,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";

const Settings = () => {
  const { user, selectedGroup, group,errorAlert,setErrorAlert,showErr,setShowErr } = useAuthContext();
  const [groupExistErr, setGroupExistErr] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup.groupName);
  const groupId = selectedGroup._id;


  const handleSubmit = async () => {
    
    const response = await axios.post(
      "http://localhost:3001/api/v1/changeGgoupName",
      { groupName, groupId }
    );

    if (response.data.exist) {
      setErrorAlert('group name is existed!');
      setShowErr(true);
    } else {
      
      //setShowErr(false);
    }
  };

    //delete Group 
    const deleteGroup=(groupId)=>{
      const response=axios.post('http://localhost:3001/api/v1/deleteGroup',{groupId})
      location.reload()
      
    };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Group Settings</h3>

        <label>
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </label>

        <br />

        <div className="muteGroup">
          <p>Mute group:</p>
          <Switch marginLeft={3} id="email-alerts" size="lg" />
        </div>

        <div className="groupSenders">
          <p>All group members can send Messages:</p>
          <Switch marginLeft={3} id="email-alerts" size="lg" />
        </div>

        <div className="groupAdmin">
            <p>group  admins:</p>
        </div>

        <din className="groupUsers">
          <strong>Group Members</strong>
          <VStack
            className="groups"
            spacing={2}
            align="stretch"
            overflowY="auto"
          >
            {selectedGroup.users.map((user) => (
              <Box>
                <strong>{user}</strong>
                <SmallCloseIcon color="red.500"></SmallCloseIcon>
              </Box>
            ))}
          </VStack>
        </din>

        <button className="save-button" type="submit">
          Save
        </button>

        <button className="delete-button" onClick={()=>deleteGroup(groupId)}>
            Delete Group
        </button>
        

        {groupExistErr && <p>group name is existed!</p>}
      </form>
    </div>
  );
};

export default Settings;
