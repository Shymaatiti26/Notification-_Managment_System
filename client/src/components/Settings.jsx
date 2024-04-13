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
  const {
    user,
    selectedGroup,
    group,
    errorAlert,
    setErrorAlert,
    showErr,
    setShowErr,
    IsGroupAdmin, setIsGroupAdmin
  } = useAuthContext();
  const [groupExistErr, setGroupExistErr] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup.groupName);
  const groupId = selectedGroup._id;

  useEffect(()=>{
    checkAdmin();
  })

  const handleSubmit = async () => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/changeGgoupName",
      { groupName, groupId }
    );

    if (response.data.exist) {
      setErrorAlert("group name is existed!");
      //setShowErr(true);
    } else {
      //setShowErr(false);
    }
  };

  //delete Group
  const deleteGroup = (groupId) => {
    const response = axios.post("http://localhost:3001/api/v1/deleteGroup", {
      groupId,
    });
    location.reload();
  };

  //check if the loged in user is the group admin
  const checkAdmin = () => {
    selectedGroup.groupAdmin.forEach((admin) => {
      if (admin == user.username) 
      setIsGroupAdmin(true);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Group Settings</h3>

        <label>
          Group Name: 
          {IsGroupAdmin &&
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />}
          {!IsGroupAdmin && <strong> {groupName}</strong>}
        </label>

        <br />

        <div className="muteGroup">
          <p>Mute group:</p>
          <Switch marginLeft={3} id="email-alerts" size="lg" />
        </div>

        {IsGroupAdmin && <div className="groupSenders">
          <p>All group members can send Messages:</p>
          <Switch marginLeft={3} id="email-alerts" size="lg" />
        </div>}

        <div className="sendByEmail">
          <p>Get the messages by mail:</p>
          <Switch marginLeft={3} id="email-alerts" size="lg" />
        </div>

        <div className="IsGroupAdmin">
          <strong>Group Admins</strong>
          <VStack
            className="groupAdmins"
            spacing={2}
            align="stretch"
            overflowY="auto"
          >
            {selectedGroup.groupAdmin.map((admin) => (
              <Box>
                <strong>{admin}</strong>
                {IsGroupAdmin &&<SmallCloseIcon color="red.500"></SmallCloseIcon>}
              </Box>
            ))}
          </VStack>
        </div>

        <div className="groupUsers">
          <strong>Group Members</strong>
          <VStack
            className="groupMembers"
            spacing={2}
            align="stretch"
            overflowY="auto"
          >
            {selectedGroup.users.map((user) => (
              <Box>
                <strong>{user}</strong>
                {IsGroupAdmin &&<SmallCloseIcon color="red.500"></SmallCloseIcon>}
              </Box>
            ))}
          </VStack>
        </div>

        <button className="save-button" type="submit">
          Save
        </button>

        {IsGroupAdmin && 


        <button className="delete-button" onClick={() => deleteGroup(groupId)}>
          Delete Group
        </button>}

        {groupExistErr && <p>group name is existed!</p>}
      </form>
    </div>
  );
};

export default Settings;
