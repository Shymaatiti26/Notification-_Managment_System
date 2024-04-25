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
import Select from 'react-select';

const Settings = () => {
  const {
    user,
    selectedGroup,
    IsGroupAdmin,
    setIsGroupAdmin,
    groupSenders,
    setGroupSenders,
    muteGroup,
    setMuteGroup,
  } = useAuthContext();
  const [groupExistErr, setGroupExistErr] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup.groupName);
  const groupId = selectedGroup._id;
  const userId = user._id;
  const [users, setUsers] = useState([]);
  const [groupSuccessMsg, setGroupSuccessMsg] = useState();
  const [options, setOptions] = useState([]);
  const [toGroups, setToGroups] = useState([]);

  useEffect(() => {
    checkAdmin();
    getGroupUsers();
  });
  //1.8.1.1.	handleSubmit: handle group name input change and save in db
  const handleSubmit = async () => {
    event.preventDefault(); // Prevent form submission
    const response = await axios.post(
      "http://localhost:3001/api/v1/changeGgoupName",
      { groupName, groupId }
    );

    if (response.data.exist) {
      setGroupExistErr(true);
      setGroupSuccessMsg(false);
    } else {
      setGroupExistErr(false);
      setGroupSuccessMsg(true);
    }
  };

  useEffect(() => {


   
    const fetchUsers = async () => {
      
      
      try {
        
        //get all existing users
        const response = await axios.get('http://localhost:3001/api/admin/users');
       // setUsers(response.data);
        const givenOptions = response.data.users.map(user => ({
          label: user.username,
          value: user._id
        }));
/*
        //get all existing groups
        const response = await axios.get('http://localhost:3001/api/v1/getGroups');
        console.log(response.data)
        const givenOptions = response.data.groups.map(group => ({
          label: group.groupName,
          value: group
        }));*/


        setOptions(givenOptions)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

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

  /*
  //handle the all group members can send switcher change
  const handleGroupSendersChange = async () => {
    setGroupSenders(!groupSenders);
    const response = await axios.post(
      "http://localhost:3001/api/v1/setGroupSender",
      { groupId, groupSenders }
    );
  };*/

  const handleGroupSendersChange = async () => {
    // Set the groupSenders state and use a callback function to execute axios.post
    setGroupSenders((prevGroupSenders) => {
      // Toggle the groupSenders state
      const newGroupSenders = !prevGroupSenders;

      // Now that the state has been updated, make the axios.post call
      axios
        .post(
          "http://localhost:3001/api/v1/setGroupSender",
          { groupId, groupSenders: newGroupSenders } // Use the updated state here
        )
        .then((response) => {
          // Handle response if needed
        })
        .catch((error) => {
          // Handle error if needed
        });

      // Return the new value of groupSenders
      return newGroupSenders;
    });
  };

  const handleMuteGroupChange = async () => {
    // Set the muteGroup state and use a callback function to execute axios.post
    setMuteGroup((prevMuteGroup) => {
      // Toggle the muteGroup state
      const newMuteGroup = !prevMuteGroup;

      // Now that the state has been updated, make the axios.post call
      axios
        .post(
          "http://localhost:3001/api/v1/setMuteGroup",
          { groupId, userId, muteGroup: newMuteGroup } // Use the updated state here
        )
        .then((response) => {
          // Handle response if needed
        })
        .catch((error) => {
          // Handle error if needed
        });

      // Return the new value of muteGroup
      return newMuteGroup;
    });
  };


  const handleGroupsChange = (e) => {
    const selectedGroups = Array.from(e, (option) => option.value);
    setToGroups(selectedGroups);
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

        {groupExistErr && (
                <div className="error">This group name exist</div>
              )}
              {groupSuccessMsg && (
                <div className="successMsg">Group created successfuly</div>
              )}



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
          <div>
        <label>
            Add new admin:
            <Select
            options={options}
            isMulti
            onChange={handleGroupsChange}
            />
          </label>
        </div>
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
      </form>
    </div>
    
  );
};

export default Settings;
