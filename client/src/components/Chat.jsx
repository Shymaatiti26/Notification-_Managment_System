// src/components/Chat.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";
import ScrollToBottom from "react-scroll-to-bottom";
import { useAuthContext } from "../hooks/useAuthComtext";
import axios from "axios";
import { SettingsIcon, CloseIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Settings from "./Settings";
import DatePicker from "react-datepicker";
import sound from '../assets/sound.wav'

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    notification,
    setNotification,
    selectedGroup,
    setSelectedGroup,
    setShowChat,
    socket,
    setSocket,
    IsGroupAdmin,
    setIsGroupAdmin,
  } = useAuthContext();
  const groupData = JSON.parse(localStorage.getItem("group"));
  let groupId = selectedGroup._id;
  const [selectedDate, setSelectedDate] = useState(null);
  const [sendLater, setSendLater] = useState(false);

  useEffect(() => {
    //setGroupId(selectedGroup._id)
    groupId = selectedGroup._id;
    getGroupMessages();
    checkAdmin();
  }, [selectedGroup]);

  useEffect(() => {
    // Connect to the server
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("receive-message", (message,sendLater) => {
      console.log("tttt");
      setMessages((prevMessages) => [...prevMessages, message]);
      if(!selectedGroup._id===message.groupId){
      setNotification((prevNotif) => [...prevNotif, message]);
      playSound();
      }
      if (sendLater){
        //set the sendLater false
      }
      //saveMessageToServer(message,sendLater);
      

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
  const saveMessageToServer = async (message,sendLater) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/getMessage",
      { message ,sendLater}
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
    let timeSend = null;//flag if the message is schedualed 
    if(sendLater===true){
      timeSend = selectedDate.getHours()+ ":" + selectedDate.getMinutes();
    }else{
      timeSend = new Date(Date.now()).getHours() + ":" + new Date().getMinutes()
    }

    if (inputMessage.trim() !== "") {
      const messageData = {
        groupId: groupId,
        sender: user.username,
        message: inputMessage,
        timeSent:timeSend,
        users: selectedGroup.users,
        group: selectedGroup,
        sendLater:sendLater,
      };
      setLatestMessage(messageData.groupId, messageData);

      await socket.emit("send-message", messageData,sendLater);
      setInputMessage("");

      //if(sendLater===true){
        //save schedualed message to db
        saveMessageToServer(messageData,sendLater);

      //}


      setSendLater(false);
    }
  };

  const joinGroup = async () => {
    await socket.emit("joinGroup", groupId);
  };

  //join user room for notification
  const setUserRoom = async () => {
    await socket.emit("userRoom", user._id);
  };

  //check if the loged in user is the group admin
  const checkAdmin = () => {
    let isAdmin = false; // Flag variable to track admin status
    selectedGroup.groupAdmin.forEach((admin) => {
      if (admin === user.username) {
        isAdmin = true;
      }
    });
    setIsGroupAdmin(isAdmin);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //turn date picker on/of
  const turnDatePicker = () => {
    if (sendLater === true) {
      setSendLater(false);
    } else {
      setSendLater(true);
    }
  };

  const playSound =() =>{
    new Audio (sound).play();

  };




  return (
    <div className="chatMain-container ">
      <div className="closeIcon">
        <CloseIcon
          cursor="pointer"
          color="white"
          marginLeft="auto"
          onClick={() => {
            setShowChat(false);
          }}
        />
      </div>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
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
          <SettingsIcon cursor="pointer" boxSize={6} onClick={onOpen} />
        </div>
      </div>

      <div className="chat-body">
        <ScrollToBottom className="message-container">
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
      {IsGroupAdmin && (
        <div className="chat-footer">
          <div className="senMessage">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <button onClick={sendMessage}>Send</button>
            <CalendarIcon
              onClick={() => turnDatePicker()}
              boxSize={7}
              color={"#420e72"}
              marginLeft={"10px"}
              cursor={"pointer"}
            ></CalendarIcon>
          </div>
          {sendLater && (
            <div className="sendLater">
              <strong>when to send:</strong>
              <DatePicker
                className="datePicker"
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
