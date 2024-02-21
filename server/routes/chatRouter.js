var express = require('express')
var router = express.Router();
const cors = require("cors")
const UsersModel = require('../models/User')
const app=express()
app.use(express.json())
const http = require('http');
const socketIo = require('socket.io');


router.post('/chat/:username', async (req, res) => {
    const server = http.createServer(app);
    const io = socketIo(server, {
        cors: {
          origin: ['http://localhost:5173', 'http://localhost:3000'], // Replace with your React app's URL
          methods: ['GET', 'POST'],
        },
       });
 
    // Socket.IO event handling for chat
io.on('connection', (socket) => {
    console.log('User connected');
  
    // Listen for incoming chat messages
    socket.on('send-message', (msg) => {
      // Broadcast the message to all connected clients
      io.emit('receive-message', msg);
      console.log(msg)
    });
  
    // Cleanup on user disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

});

  // Use http.createServer to create a server
const server = http.createServer(app);
/*
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  }));*/




  module.exports = router;