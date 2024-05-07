import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthComtext";
import { Switch } from "@chakra-ui/react";
import "./Settings.css";
import { VStack, Box } from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import Select from "react-select";

const Settings = () => {
  const {
    user,
    selectedGroup,
    setSelectedGroup,
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
  const [members, setMembers] = useState([]);
  const [selectUsers, setSelectUsers] = useState([]);
  const [adminsOptions, setAdminsOptions] = useState([]);
  const [choosenAdmins, setChoosenAdmins] = useState([]);
  const [showAddAdminSelect, setShowAddAdminSelect] = useState(false);
  const [showAddMemberSelect, setShowAddMemberSelect] = useState(false);

  useEffect(() => {
    checkAdmin();
    getGroupUsers();
    getGroupByID();
  });
  //1.8.1.1.	handleSubmit: handle group name input change and save in db
  const updateGroup = async () => {
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
    fetchUsers();
  }, []);

  //fetch users to show on the select
  const fetchUsers = async () => {
    try {
      //get all existing users
      const response = await axios.get("http://localhost:3001/api/users");
      setSelectUsers(response.data);
      const filteredUsers = selectUsers.filter((user) => user !== user1Id);

      const givenOptions = response.data.map((user) => ({
        label: user.username,
        value: user._id,
      }));

      const response2 = await axios.post(
        "http://localhost:3001/api/v1/getGroupUsers",
        { groupId }
      );
      const adminsOptions = response2.data.map((user) => ({
        label: user.username,
        value: user,
      }));

      setAdminsOptions(
        adminsOptions.filter(
          (admin) => !selectedGroup.groupAdmin.includes(admin.label)
        )
      );

      setOptions(
        givenOptions.filter(
          (option) => !selectedGroup.users.includes(option.value)
        )
      );
    } catch (error) {
      console.error("Error fetching users:", error);
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

  //handle group senders swich
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

  //handle Mute group swich
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
  //handle selected  Members in the select
  const handleMembersChange = (e) => {
    const selectedGroups = Array.from(e, (option) => option.value);
    setMembers(selectedGroups);
  };

  const handleAdminsChange = (e) => {
    const selectedAdmins = Array.from(e, (adminsOption) => adminsOption.label);
    setChoosenAdmins(selectedAdmins);
  };

  const addAdmins = async () => {
    choosenAdmins.map(async (admin) => {
      const adminUsername = admin;
      const response = await axios.post(
        "http://localhost:3001/api/v1/addAdmins",
        { adminUsername, groupId }
      );
    });
  };

  const addMember = async () => {
    members.map(async (option) => {
      const userId = option;
      response = await axios.put("http://localhost:3001/api/v1/UpdateGroup", {
        userId,
        groupId,
      });
    });
  };

  const getGroupByID = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/getGroupById",
        { groupId }
      );
      setSelectedGroup(response.data);
    } catch (error) {
      console.error("Error fetching group details:", error);
      // Handle error if needed
    }
  };

  const deleteAdmin = async (adminUsername) => {
    response = await axios.post("http://localhost:3001/api/v1/deleteAdmin", {
      groupId,
      adminUsername,
    });
  };

  return (
    <div>
      <div>
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
              <button className="save-button" onClick={updateGroup}>
                Save
              </button>
            </div>
          )}
          {!IsGroupAdmin && <strong> {groupName}</strong>}
        </label>

        {groupExistErr && <div className="error">This group name exist</div>}
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

        <div className="GroupAdmins-Container">
          <div className="groupAdminHead">
            <strong>Group Admins</strong>
            <div className="addAdminContainer">
              {showAddAdminSelect && (
                <div className="select-admins">
                  <label>
                    <Select
                      options={adminsOptions}
                      isMulti
                      onChange={handleAdminsChange}
                      placeholder="Choose admin"
                    />
                  </label>
                  <button className="addButton" onClick={() => addAdmins()}>
                    Add
                  </button>
                </div>
              )}
              {IsGroupAdmin && (
                <div className="add-admin-icon">
                  <span
                    class="material-symbols-outlined"
                    onClick={() => setShowAddAdminSelect(!showAddAdminSelect)}
                  >
                    group_add
                  </span>
                </div>
              )}
            </div>
          </div>
          <VStack
            className="groupAdmins"
            spacing={2}
            align="stretch"
            overflowY="auto"
          >
            {selectedGroup.groupAdmin.map((admin) => (
              <Box className="groupAdmin">
                <strong>{admin}</strong>
                {!(admin === user.username) && IsGroupAdmin && (
                  <button onClick={() => deleteAdmin(admin)}>
                    <SmallCloseIcon
                      className="closeIcon"
                      boxSize={5}
                      color="red.500"
                    ></SmallCloseIcon>
                  </button>
                )}
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
          <div className="groupMembersHead">
            <strong>Group Members</strong>
            <div className="addMemberContainer">
              {showAddMemberSelect && (
                <div className="select-members">
                  <label>
                    <Select
                      options={options}
                      isMulti
                      onChange={handleMembersChange}
                      placeholder="Choose members"
                    />
                  </label>
                  <button className="addButton" onClick={addMember}>
                    Add
                  </button>
                </div>
              )}

              {IsGroupAdmin && (
                <div className="add-admin-icon">
                  <span
                    class="material-symbols-outlined"
                    onClick={() => setShowAddMemberSelect(!showAddMemberSelect)}
                  >
                    group_add
                  </span>
                </div>
              )}
            </div>
          </div>
          <VStack
            className="groupMembers"
            spacing={2}
            align="stretch"
            overflowY="auto"
          >
            {users.map((user) => (
              <Box className="groupMember">
                <strong>{user.label}</strong>
                {IsGroupAdmin &&
                  !(user.value._id === userId) &&
                  !selectedGroup.groupAdmin.includes(user.label) && (
                    <button onClick={() => deleteGroupMember(user.value._id)}>
                      <SmallCloseIcon
                        className="closeIcon"
                        boxSize={5}
                        color="red.500"
                      ></SmallCloseIcon>
                    </button>
                  )}
                {selectedGroup.groupAdmin.includes(user.label) && (
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
      </div>
    </div>
  );
};

export default Settings;
