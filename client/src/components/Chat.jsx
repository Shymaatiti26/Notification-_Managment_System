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


    // Listen for incoming messages
    newSocket.on('receive-message', (message) => {
      //console.log(message)
      setMessages((prevMessages) => [...prevMessages, message]);
    });
/*
    useEffect(()=>{
      //location.reload();

    },[groupData])
*/
    


    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  //get group data groupName,LastMessages
  const getGroupData = async ()=>{
    const response = await axios.post('',{groupId})


  }

  const sendMessage = async () => {
    joinGroup();
    if (inputMessage.trim() !== '') {
      const messageData= {
        groupId :groupId,
        author: user.username,
        message: inputMessage,
        time: new Date(Date.now()).getHours()  + ":" + new Date().getMinutes(),

      }
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
          {messages.map((message) => {
            return (
              <div className='message' id={user.username===message.author ? "you" : "other"}>
                <div className='message-content'>
                  <p>{message.message}</p>
                </div>
                <div className='message-meta'>
                  <p>{message.time} {message.author} </p>
                </div>

              </div>
            )
          })}
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
