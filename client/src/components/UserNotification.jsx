import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import NotificationBadge from "react-notification-badge";
import { useAuthContext } from "../hooks/useAuthComtext";
import { Effect } from "react-notification-badge";
import { BellIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useState, useEffect } from "react";

const UserNotifications = () => {
  const {
    notification,
    setNotification,
    selectedGroup,
    setSelectedGroup,
    setSelectedUser,
    showChat,
    showUserChat,
    setShowChat,
    setShowUserChat,
    user,
    userNotification, 
    setUserNotification
  } = useAuthContext();
  const userId = user._id;
  //let notifications = [null];

  useEffect(() => {
    getUserNotifications();
  },[userNotification]);

  //delete notification from user notifications db
  const deleteNotification = async (notifId) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/deleteNotification",
      { notifId, userId }
    );
  };

  //get use notification from the database
  const getUserNotifications = async () => {
   // const userId = user._id;
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/getUserNotifications",
        { userId }
      );
  
      const userNotifications = response.data;
      //console.log('my notifs: '+notifications)
      
      // Fetch group details for each notification
      const updatedNotifications = await Promise.all(
        userNotifications.map(async (notif) => {
          const groupId = notif.group;
          //console.log('my notifs: '+notif.group)
          const groupResponse = await axios.get(
            "http://localhost:3001/api/v1/getUserByID",{groupId}
          );
          const groupData = groupResponse.data;
          
          return { ...notif, group: groupData }; // Replace group ID with group details
        })
      );
  
      setUserNotification(updatedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  
  return (
    <div>
      <Menu>
        <MenuButton marginRight={5}>
          <NotificationBadge
            count={userNotification.length}
            effect={Effect.SCALE}
          />
          <BellIcon boxSize={6} marginRight={3} />
        </MenuButton>
        <MenuList color="black" pl={2}>
          {!userNotification.length && "No New Messages"}
          {userNotification.map((notif) => (
            <MenuItem
              key={notif._id}
              onClick={() => {
                setSelectedUser(notif.group);

                setShowUserChat(true);
                const notifId = notif._id;
                deleteNotification(notifId);
                setUserNotification(userNotification.filter((n) => n !== notif));
              }}
            >
              {`${notif.timeSent} ${notif.groupName}: ${notif.message}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default UserNotifications;
