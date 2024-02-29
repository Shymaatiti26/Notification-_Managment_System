// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css'
import { useParams } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ( {room} ) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const { username } = useParams();
  
  


  useEffect(() => {
    // Connect to the server
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on('receive-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const messageData= {
        room :room,
        author: username,
        message: inputMessage,
        time: new Date(Date.now()).getHours()  + ":" + new Date().getMinutes(),

      }
      await socket.emit('send-message', messageData);
      setInputMessage('');
    }
  };

  

  

  return (
    <div className='main-container '>

      <div className='chat-header'>
        <p>Group Name</p>
      </div>

      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messages.map((message) => {
            return (
              <div className='message' id={username===message.author ? "you" : "other"}>
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
