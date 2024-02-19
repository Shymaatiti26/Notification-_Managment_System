import Chat from '../client/src/Chat';

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();


// Use http.createServer to create a server
const server = http.createServer(app);
 // Initialize Socket.IO with the server
 const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Replace with your React app's URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for incoming messages
  socket.on('message', (message) => {
    // Broadcast the message to all connected clients
    io.emit('message', message);
  });

  // Cleanup on user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export default Chat