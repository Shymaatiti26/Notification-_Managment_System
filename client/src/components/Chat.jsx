// src/components/Chat.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";
import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { useAuthContext } from "../hooks/useAuthComtext";
import axios from "axios";
import { SettingsIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Settings from "./Settings";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    notification,
    setNotification,
    selectedGroup,
    setSelectedGroup,
  } = useAuthContext();
  const groupData = JSON.parse(localStorage.getItem("group"));
  //const [groupId,setGroupId] = useState();
  let groupId = selectedGroup._id;

  useEffect(() => {
    //setGroupId(selectedGroup._id)
    groupId = selectedGroup._id;
    getGroupMessages();
  }, [selectedGroup]);

  useEffect(() => {
    // Connect to the server
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("receive-message", (message) => {
      //console.log(message)
      setMessages((prevMessages) => [...prevMessages, message]);
      setNotification((prevNotif) => [...prevNotif, message]);
      saveMessageToServer(message);
    });

    /*
    // Listen for user incoming notification
    newSocket.on('receive-notif', (notif) => {
      console.log(notification)
      setNotification((prevNotif) => [...prevNotif, notif]);
    });*/

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  //save group message on db
  const saveMessageToServer = async (message) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/getMessage",
      { message }
    );
  };

  //get group LastMessages
  const getGroupMessages = async () => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/sendMessages",
      { groupId }
    );
    console.log(response.data.message);
    setMessages(response.data.messages);
  };

  //set the latest message in group
  const setLatestMessage = async (groupId, latestMessage) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/setLatestMessage",
      { groupId: groupId, latestMessage: latestMessage }
    );
  };

  const sendMessage = async () => {
    joinGroup();
    setUserRoom();
    if (inputMessage.trim() !== "") {
      const messageData = {
        groupId: groupId,
        sender: user.username,
        message: inputMessage,
        timeSent:
          new Date(Date.now()).getHours() + ":" + new Date().getMinutes(),
        users: selectedGroup.users,
        groupName: selectedGroup.groupName,
        group: selectedGroup,
      };
      setLatestMessage(messageData.groupId, messageData.message);

      console.log("sending", messageData);
      console.log("user", user);
      await socket.emit("send-message", messageData);
      //await socket.emit('sendNotif',messageData);
      setInputMessage("");
    }
  };

  const joinGroup = async () => {
    await socket.emit("joinGroup", groupId);
  };

  //join user room for notification
  const setUserRoom = async () => {
    await socket.emit("userRoom", user._id);
  };

  return (
    <div className="chatMain-container ">

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#b8b4da">
          <ModalCloseButton />
          <ModalBody>
            <Settings></Settings>
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className="chat-header">
        <p>{selectedGroup.groupName}</p>
        <div className="settingIcon">
          <SettingsIcon boxSize={6} onClick={onOpen} />
        </div>
      </div>

      <div className="chat-body">
        <ScrollToBottom className="message-container" >
          <div className="chatMessages-body">
            {messages.map((message) => {
              return (
                <div
                  className="message"
                  id={user.username === message.sender ? "you" : "other"}
                >
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                  <div className="message-meta">
                    <p>
                      {message.timeSent} {message.sender}{" "}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollToBottom>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
