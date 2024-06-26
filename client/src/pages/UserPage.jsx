import "./UserPage.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Login";
import "../components/Profile";
import Chat from "../components/Chat";
import { useAuthContext } from "../hooks/useAuthComtext";
import { Grid, GridItem } from "@chakra-ui/react";
import UserGroupsList from "../components/UserGroupsList";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import Groups from "./Groups";
import ScheduledMsgsList from "../components/ScheduledMsgsList";
import Notification from "../components/Notifications";
import Users from "../components/Users";
import { useToast } from '@chakra-ui/react'
import UserChatList from '../components/UserChatList'
import UserChat from "../components/UserChat"
import Profile from "../components/Profile"
import UserNotifications from "../components/UserNotification"

//import { useLogout } from './hooks/useLogout';
const UserPage = () => {
  //const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const navigate = useNavigate();
  const {
    user,
    errorAlert,
    setErrorAlert,
    showErr,
    setShowErr,
    setIsGroupAdmin,
    IsGroupAdmin,
    showUserChat,
    setShowUserChat,
    SetnotificationsRecived
  } = useAuthContext();
  const { dispatch } = useAuthContext();
  //const groupData=JSON.parse(localStorage.getItem('group',))
  const {
    notification,
    setNotification,
    selectedGroup,
    setSelectedGroup,
    showChat,
    setShowChat,
  } = useAuthContext();
  const [showUsers, setShowUsers] = useState(false);
  const [showGroups, setShowGroups] = useState(true);

  useEffect(() => {}, [notification]);
  useEffect(() => {
    setShowChat(false);
    setShowUsers(false);
    setShowGroups(true);
  }, []);

  const handleProfile = async () => {
    navigate("/Profile");
  };




  const handleLogout = async () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    navigate("/Home");
  };

  const handleGroupsClick = () => {
    // setIsGroup(true);
     setShowGroups(false);
     setShowUsers(true);
    // SetnotificationsRecived("fromGroup");
   
   };
   
   const handleUsersClick = () => {
     ///setIsGroup(false);
     setShowGroups(true);
     setShowUsers(false);
     //SetnotificationsRecived("fromUser");
   };

   return (
    <div className="main-container">
      {showErr && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Your browser is outdated!</AlertTitle>
          <AlertDescription>
            Your Chakra experience may be degraded.
          </AlertDescription>
        </Alert>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {user && (
        <div className="navbar">
          <div className="navbar-left">
            <img className="navbar-logo" src="/images/logo.png" alt="Logo" />
          </div>
          <div className="navbar-center">
            
            <ScheduledMsgsList className="navbar-button" ></ScheduledMsgsList>
            <Groups></Groups>
            <Users></Users>
          </div>
          <div className="navbar-right">
            <Notification></Notification>

            <div className="navbar-username" onClick={toggleDropdown}>
              <span className="username">Welcome {user.username} &#9660;</span>
              <div className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>

                  <Profile></Profile>

                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Grid         className="mainContainer"
        templateColumns="0.3fr 1fr"
        templateRows="1fr"
        gap={6}>
      <GridItem w="100%" h="20"> {/* Adjust height as needed */}
      <button
        className={`navbar-button ${!showGroups ? 'active' : ''}`}
        onClick={handleGroupsClick}
      >
        Groups
      </button>
      <button
        className={`navbar-button ${!showUsers ? 'active' : ''}`}
        onClick={handleUsersClick}
      >
        Users
      </button>

      {!showGroups && <UserGroupsList />}
      {!showUsers && <UserChatList />}
    </GridItem>
        <GridItem w="100%" h="10" className="chat-box">
          {" "}
          {showChat && <Chat />}
          {showUserChat && <UserChat />}
        </GridItem>
        {/* <GridItem w="100%" h="10" className="chat-box">
          {" "}
          {showUserChat && <UserChat />}
        </GridItem> */}
      </Grid>
    </div>
  );
/*
  return (
    <div className="main-container">
      {showErr && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Your browser is outdated!</AlertTitle>
          <AlertDescription>
            Your Chakra experience may be degraded.
          </AlertDescription>
        </Alert>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {user && (
        <div className="navbar">
          <div className="navbar-left">
            <img className="navbar-logo" src="/images/logo.png" alt="Logo" />
          </div>
          <div className="navbar-center">
            <ScheduledMsgsList className="navbar-button"></ScheduledMsgsList>
            <Groups></Groups>
            <Users></Users>
          </div>
          <div className="navbar-right">
            <Notification></Notification>

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

      <Grid
        className="mainContainer"
        templateColumns="0.3fr 1fr"
        templateRows="1fr"
        gap={6}
      >
        <GridItem>
          <UserGroupsList />
        </GridItem>
        <GridItem>{showChat && <Chat />}</GridItem>
      </Grid>
    </div>
  );*/
};

export default UserPage;
