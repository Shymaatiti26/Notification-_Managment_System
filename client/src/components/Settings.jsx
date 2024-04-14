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
    IsGroupAdmin,
    setIsGroupAdmin,
    groupSenders,
    setGroupSenders,muteGroup,setMuteGroup,
  } = useAuthContext();
  const [groupExistErr, setGroupExistErr] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup.groupName);
  const groupId = selectedGroup._id;
  const userId = user._id;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    checkAdmin();
    getGroupUsers();
  });

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
      if (admin == user.username) setIsGroupAdmin(true);
    });
  };

  // get the group users names
  const getGroupUsers = async () => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/getGroupUsers",
      { groupId }
    );
    const users = response.data.map((user) => ({
      label: user.username,
      value: user,
    }));
    setUsers(users);
  };

  //deletre group member from the group
  const deleteGroupMember = async (userId) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1//UnfollowGroup",
      { groupId, userId }
    );
  };

  //handle the all group members can send switcher chenge
  const handleGroupSendersChange = async () => {
    setGroupSenders(!groupSenders);
    const response = await axios.post(
      "http://localhost:3001/api/v1/setGroupSender",
      { groupId, groupSenders }
    );
  };

  //handle the mute group switcher chenge
  const handleMuteGroupChange = async () => {
    setMuteGroup(!muteGroup);
    const response = await axios.post(
      "http://localhost:3001/api/v1/setMuteGroup",
      { groupId, userId,muteGroup }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Group Settings</h3>

        <label>
          Group Name:
          {IsGroupAdmin && (
            <div className="changeGroupName2">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
              <button className="save-button" type="submit">
                Save
              </button>
            </div>
          )}
          {!IsGroupAdmin && <strong> {groupName}</strong>}
        </label>

        <br />

        <div className="muteGroup">
          <p>Mute group:</p>
          <Switch
            marginLeft={3}
            id="Mute-alerts"
            size="lg"
            isChecked={muteGroup}
            onChange={handleMuteGroupChange}
          />
        </div>

        {IsGroupAdmin && (
          <div className="groupSenders">
            <p>All group members can send Messages:</p>
            <Switch
              marginLeft={3}
              id="sender-alerts"
              size="lg"
              isChecked={groupSenders}
              onChange={handleGroupSendersChange}
            />
          </div>
        )}

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
              <Box className="groupAdmin">
                <strong>{admin}</strong>
                {admin === user.username && (
                  <span style={{ fontWeight: "bold", color: "gray" }}>
                    {" "}
                    (you)
                  </span>
                )}
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
            {users.map((user) => (
              <Box className="groupMember">
                <strong>{user.label}</strong>
                {!(user.value._id === userId) && IsGroupAdmin && (
                  <button onClick={() => deleteGroupMember(user.value._id)}>
                    <SmallCloseIcon
                      className="closeIcon"
                      boxSize={5}
                      color="red.500"
                    ></SmallCloseIcon>
                  </button>
                )}
                {user.value._id === userId && (
                  <span style={{ fontWeight: "bold", color: "gray" }}>
                    {" "}
                    (Admin)
                  </span>
                )}
              </Box>
            ))}
          </VStack>
        </div>

        {IsGroupAdmin && (
          <button
            className="delete-button"
            onClick={() => deleteGroup(groupId)}
          >
            Delete Group
          </button>
        )}

        {groupExistErr && <p>group name is existed!</p>}
      </form>
    </div>
  );
};

export default Settings;
