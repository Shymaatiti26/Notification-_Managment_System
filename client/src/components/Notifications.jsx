import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import NotificationBadge from "react-notification-badge";
import { useAuthContext } from "../hooks/useAuthComtext";
import { Effect } from "react-notification-badge";
import { BellIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Notifications = () => {
  const {
    notification,
    setNotification,
    selectedGroup,
    setSelectedGroup,
    setSelectedUser,
    setShowChat, 
    setShowUserChat,
    user,
    userNotification, 
    setUserNotification
  } = useAuthContext();
  const userId = user._id;
  
  useEffect(() => {
    getUsersNotifications();
  }, [notification]); // Corrected dependencies array

  // delete notification from user notifications db
  const deleteNotification = async (notifId) => {
    try {
      await axios.post(
        "http://localhost:3001/api/v1/deleteNotification",
        { notifId, userId }
      );
      // If the deletion is successful, update the state
      setNotification(notification.filter((n) => n._id !== notifId));
      //setUserNotification(userNotification.filter((n) => n._id !== notifId));
    } catch (error) {
      console.error("Error delete notification:", error);
    }
  };

  const getUsersNotifications =async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/getUserNotifications",
        {
          params: {
            userId: userId // Assuming userId is defined in your scope
          }
        }
      );
             const notifications = response.data;
             //change:
             const filteredNotifications = notifications.filter(notif => notif.notificationsRecived !== "fromUser");

            // Fetch group details for each notification
            const updatedNotifications = await Promise.all(
              filteredNotifications.map(async (notif) => {
                const groupId = notif.group;
                //console.log('my notifs: '+notif.group)
                const groupResponse = await axios.get(
                  "http://localhost:3001/api/v1/getGroupByID",{groupId}
                );
                const groupData = groupResponse.data;
                
                return { ...notif, group: groupData }; // Replace group ID with group details
              })
            );
            // Concatenate filtered notifications with updated notifications
            //change
            const allNotifications = [...notifications.filter(notif => notif.notificationsRecived === "fromUser"), ...updatedNotifications];

            setNotification(allNotifications);

    } catch (error) {
      console.error("Error fetching user notifications:", error);
    }
  };

 
  return (
    <div>
      <Menu>
        <MenuButton marginRight={5}>
          <NotificationBadge
            count={notification.filter(notif=>notif.sender!== userId).length}
            effect={Effect.SCALE}
          />
          <BellIcon boxSize={6} marginRight={3} />
        </MenuButton>
        <MenuList color="black" pl={2}>
          {( notification.filter(notif=>notif.sender!== userId).length === 0) && "No New Messages"}
          
          {notification.map((notif) => (
            <MenuItem
              key={notif._id}
              onClick={() => {
                if(notif.notificationsRecived === "fromUser"){
                  notif.senderDetails.userId=notif.sender;
                  setSelectedUser(notif.senderDetails);
                  setShowUserChat(true);
                  deleteNotification(notif._id);
                }
                else {
                  setSelectedGroup(notif.group);
                  setShowChat(true);
                  deleteNotification(notif._id);
                }
                
              }}
            >
             {notif.notificationsRecived === "fromUser" ? (
              //TODO:  change sender to senderName after add it in db
    `${notif.timeSent} ${notif.senderName}: ${notif.message}` 
  ) : (
    `${notif.timeSent} ${notif.groupName}: ${notif.message}`
  )}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default Notifications;
