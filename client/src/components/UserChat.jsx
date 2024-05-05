import React, { useState, useEffect } from "react";
import io from "socket.io-client";
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
import UserSettings from "./UserSettings";
import DatePicker from "react-datepicker";
import sound from '../assets/sound.wav';
var newSocket,openedChat,userId;

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    selectedUser,
    setSelectedUser,
    setUserNotification,
    userNotification,
    userSocket, 
    notification,
    setNotification,
    setUserSocket,setShowUserChat,
    
  } = useAuthContext();

  //const groupData = JSON.parse(localStorage.getItem("group"));
  const storedFollowedUsers = JSON.parse(localStorage.getItem("followedUsers"));
 // const userId= storedFollowedUsers._id;
  const userData = JSON.parse(localStorage.getItem("user")); //get the user  info of current logged in user
  const adminId = userData._id;
  //let userId = selectedUser.userId;
  //let username= selectedUser.username;
  //let groupId = selectedGroup._id;
  const [selectedDate, setSelectedDate] = useState(null);
  const [sendLater, setSendLater] = useState(false);
 


  useEffect(() => {
    //setGroupId(selectedGroup._id)
   // setSelectedUser(storedFollowedUsers.userId);
   userId = selectedUser.userId;
    //username= selectedUser.username;
    getUserMessages();
    openedChat =selectedUser;
    
  }, [selectedUser]);


  useEffect(() => {
    // Connect tsetUserSocketo the server for user chat
     newSocket = io("http://localhost:3001");
    setUserSocket(newSocket);
    setUserRoom();

    // Listen for incoming messages
    newSocket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });


     // Listen for user incoming notification
     newSocket.on('receive-notif', (notif, user) => {

      // Assuming you want to send the notification to the first user in the array
      const userToSendNotification = notif.userId;
      const notificationsRecived="fromUser";
  
      if((openedChat!==null ) && (openedChat.userId===notif.userId ||openedChat.userId===notif.adminId) )
      {
        setMessages((prevMessages) => [...prevMessages, notif]);
    
       }
       //else{

      // Update state with the notification
      if(!openedChat||openedChat.userId!==notif.adminId)
      {
        setNotification(prevNotif => [...prevNotif, notif]);
        console.log('notifications'+notification);
      // Play notification sound
      playSound();
      // Send notification to the selected user
      saveNotificationToServer(notif, userToSendNotification,notificationsRecived);
    }
  });
  
    //  newSocket.on('receive-notif', (notif,user) => {
    //   //console.log(notification)
    //   setNotification((prevNotif) => [...prevNotif, notif]);
    //   playSound();
    //   notif.users.forEach(user => {
    //     saveNotificationToServer(notif,user)
    //   })
    // });
    
    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);


  //save  message on db
  const saveMessageToServer = async (message,sendLater) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/getUserMessage",
      { message }
    );
    return response.data;
  };


  //set the group sendLater to false
  const setSenLaterToFalse=async (msgId)=>{
    const response = await axios.post(
      "http://localhost:3001/api/v1/setSenLaterToFalse",
      { msgId}
    );

  };

  //save notification in db 
  const saveNotificationToServer = async (notification,userId,notificationsRecived) =>{
    const response = await axios.post("http://localhost:3001/api/v1/saveNotificationforUser",{notification, userId,notificationsRecived})


  }



  //get user LastMessages
  const getUserMessages = async () => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/sendUserMessages",
      { userId,adminId }
    );
    console.log(response.data.message);
    setMessages(response.data.messages);
    console.log(messages);
  };



  //set the latest message in chat
  const setLatestUserMessage = async (userId, latestMessage) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/setLatestUserMessage",
      { adminId: adminId, userId: userId, latestMessage: latestMessage }
    );
  };


  
  //check if to send the message now or it is scheduled and send the message with sokot.io according to that
  const sendMessage = async () => {
    //joinGroup();
    //setUserRoom();
    let timeSend = null; // flag if the message is scheduled
    if (sendLater === true) {
      timeSend = selectedDate.getHours() + ":" + selectedDate.getMinutes();
    } else {
      timeSend = new Date(Date.now()).getHours() + ":" + new Date().getMinutes();
    }
  
    if (inputMessage.trim() !== "") {
      const messageData = {
        adminId: user._id,
        adminName: user.username,
        userId: selectedUser.userId,
        username: selectedUser.username,
        message: inputMessage,
        timeSent: timeSend,
        sendLater: sendLater,
      };
  
      if (sendLater === false) {
        setLatestUserMessage(userId, inputMessage);
      }
  
      const msgId = await saveMessageToServer(messageData, sendLater);
      console.log('msgIdFront:' + msgId);
      await newSocket.emit("send-message", messageData, sendLater, msgId);
      setInputMessage("");
      sendNotif(messageData, sendLater, msgId);

      setSendLater(false);
    }
  };
  
  const sendNotif =  async (messageData, sendLater, msgId) => {
    await newSocket.emit("send-notif", messageData, sendLater, msgId);


  }

//join to socke.io group
  const joinGroup = async () => {
    await newSocket.emit("joinGroup", userId);
  };

  //join user room for notification in socket.io
  const setUserRoom = async () => {
    await newSocket.emit("userRoom", user._id);
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

  //play notification sound
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
            setShowUserChat(false);
            //setSelectedUser(null);
          }}
        />
      </div>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#b8b4da">
          <ModalCloseButton />
          <ModalBody>
            <UserSettings></UserSettings>
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className="chat-header">
        <p>{selectedUser.username}</p>
        {/* <div className="settingIcon">
          <SettingsIcon cursor="pointer" boxSize={6} onClick={onOpen} />
        </div> */}
      </div>

      <div className="chat-body">
        <ScrollToBottom className="message-container">
          <div className="chatMessages-body">
            {messages.map((message) => {
              return (
                <div
                  className="message"
                  id={user.username === message.adminName ? "you" : "other"}
                >
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                  <div className="message-meta">
                    <p>
                      {message.timeSent} {message.adminName}{" "}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollToBottom>
      </div>
      {/* {( groupSenders || IsGroupAdmin) {(IsFollowedUser) && ( */}
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
      {/* )} */}
    </div>
  );
};

export default UserChat;
