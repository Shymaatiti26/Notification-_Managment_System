import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import NotificationBadge from "react-notification-badge";
import { useAuthContext } from "../hooks/useAuthComtext";
import { Effect } from "react-notification-badge";
import { BellIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Notifications = () => {
  const {
    notification,
    setNotification,
    selectedGroup,
    setSelectedGroup,
    showChat,
    setShowChat,
    user,
  } = useAuthContext();
  const userId = user._id;
  //let notifications = [null];

  useEffect(() => {
    getUserNotifications();
  },[notification]);

  //delete notification from user notifications db
  const deleteNotification = async (notifId) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/deleteNotification",
      { notifId, userId }
    );
  };

  
  const getUserNotifications = async () => {
   // const userId = user._id;
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/getUserNotifications",
        { userId }
      );
  
      const notifications = response.data;
      //console.log('my notifs: '+notifications)
      
      // Fetch group details for each notification
      const updatedNotifications = await Promise.all(
        notifications.map(async (notif) => {
          const groupId = notif.group;
          //console.log('my notifs: '+notif.group)
          const groupResponse = await axios.post(
            "http://localhost:3001/api/v1/getGroupByID",{groupId}
          );
          const groupData = groupResponse.data;
          
          return { ...notif, group: groupData }; // Replace group ID with group details
        })
      );
  
      setNotification(updatedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  

  /*
  const getGroup = async (groupId)=>{
    const respose =  await axios.post('http://localhost:3001/api/v1/getGroupByID',{groupId})
  }*/
  

  /*
  //get user notifications
  const getUserNotifications = async () => {
    const userId = user._id;
    const response = await axios.post(
      "http://localhost:3001/api/v1/getUserNotifications",
      { userId }
    );

    console.log('my notif2:'+response.data)
    setNotification(response.data);
  };*/

  return (
    <div>
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

                setShowChat(true);
                const notifId = notif._id;
                deleteNotification(notifId);
                setNotification(notification.filter((n) => n !== notif));
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

export default Notifications;
