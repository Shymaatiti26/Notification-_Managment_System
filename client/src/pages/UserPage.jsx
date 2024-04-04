import "./UserPage.css";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/Login";
import "../components/Profile";
import Chat from "../components/Chat";
import { useAuthContext } from "../hooks/useAuthComtext";
import { Grid, GridItem } from "@chakra-ui/react";
import UserGroupsList from "../components/UserGroupsList";
import { BellIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

//import { useLogout } from './hooks/useLogout';
const UserPage = () => {
  //const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const navigate = useNavigate();
  const { user,errorAlert,setErrorAlert,showErr,setShowErr } = useAuthContext();
  const { dispatch } = useAuthContext();
  //const groupData=JSON.parse(localStorage.getItem('group',))
  const { notification, setNotification, selectedGroup, setSelectedGroup } =useAuthContext();

  useEffect(() => {}, [selectedGroup,showErr]);

  const handleProfile = async () => {
    navigate("/Profile");
  };

  const handleMessage = async () => {
    navigate("/ScheduleMessage");
  };
  const handleGroups = async () => {
    navigate("/Groups");
  };

  const handleLogout = async () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    navigate("/Home");
  };

  return (
    <div className="main-container">
      {showErr && <Alert status="error">
        <AlertIcon />
        <AlertTitle>Your browser is outdated!</AlertTitle>
        <AlertDescription>
          Your Chakra experience may be degraded.
        </AlertDescription>
      </Alert>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {user && (
        <div className="navbar">
          <div className="navbar-left">
            <img className="navbar-logo" src="/images/logo.png" alt="Logo" />
          </div>
          <div className="navbar-center">
            <button className="navbar-button">Home</button>
            <button className="navbar-button" onClick={handleMessage}>
              Send Message
            </button>
            <button className="navbar-button" onClick={handleGroups}>
              Search Groups
            </button>
          </div>
          <div className="navbar-right">
            <Menu>
              <MenuButton marginRight={5}>
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <BellIcon boxSize={6} marginRight={3} />
              </MenuButton>
              <MenuList color="black" pl={2}>
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedGroup(notif.group);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {`New Message in ${notif.groupName}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <div className="navbar-username" onClick={toggleDropdown}>
              <span className="username">Welcome {user.username} &#9660;</span>
              <div className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
                <button className="dropdown-item" onClick={handleProfile}>
                  Profile
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <GridItem w="100%" h="10">
          {" "}
          <UserGroupsList></UserGroupsList>
        </GridItem>
        <GridItem w="100%" h="10" className="chat-box">
          {" "}
          {selectedGroup && <Chat />}
        </GridItem>
      </Grid>
      
    </div>
  );
};

export default UserPage;
