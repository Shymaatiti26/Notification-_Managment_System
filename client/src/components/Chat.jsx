// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css'
import { useParams } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useAuthContext } from '../hooks/useAuthComtext';
import axios from 'axios';

const Chat = ( {groupId} ) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const {user} = useAuthContext()
  const groupData=JSON.parse(localStorage.getItem('group'))
  
  


  useEffect( () => {
    // Connect to the server
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

     getGroupMessages(groupData.groupId);
    // Listen for incoming messages
    newSocket.on('receive-message', (message) => {
      //console.log(message)
      setMessages((prevMessages) => [...prevMessages, message]);
      saveMessageToServer(message);
    });

    


    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  //save group message on db
  const saveMessageToServer =async (message) =>{
    const response = await axios.post('http://localhost:3001/api/v1/getMessage',{message})
  }

  //get group LastMessages
  const getGroupMessages = async ()=>{
    const response = await axios.post('http://localhost:3001/api/v1/sendMessages',{groupId})
    console.log(response.data.message)
    setMessages(response.data.messages)


  }

  //set the latest message in group
  const setLatestMessage = async (groupId,latestMessage) =>{
     const response = await axios.post('http://localhost:3001/api/v1/setLatestMessage',{groupId:groupId,latestMessage:latestMessage})

  }

  const sendMessage = async () => {
    joinGroup();
    if (inputMessage.trim() !== '') {
      const messageData= {
        groupId :groupId,
        sender: user.username,
        message: inputMessage,
        timeSent: new Date(Date.now()).getHours()  + ":" + new Date().getMinutes(),

      }
      setLatestMessage(messageData.groupId,messageData.message);

      console.log("sending", messageData);
      console.log("user", user);
      await socket.emit('send-message', messageData);
      setInputMessage('');
    }


  };

  const joinGroup= async ()=>{
    await socket.emit('joinGroup',groupId);
  }


  

  

  return (
    <div className='chatMain-container '>

      <div className='chat-header'>
        <p>{groupData.groupName}</p>
      </div>

      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          <div className='chatMessages-body'>
          {messages.map((message) => {
            return (
              <div className='message' id={user.username===message.sender ? "you" : "other"}>
                <div className='message-content'>
                  <p>{message.message}</p>
                </div>
                <div className='message-meta'>
                  <p>{message.timeSent} {message.sender} </p>
                </div>

              </div>
            )
          })}
          </div>
        </ScrollToBottom>
      </div>

      <div className='chat-footer'>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress ={(event)=>{
            event.key==="Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
};

export default Chat;
