const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const connectDB = require('./connectDB');
const loginRouter= require('./routes/loginRouter');
const signup= require('./routes/signupRouter');
const newMessage= require('./routes/NewMessageHandler');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const Profile = require('./routes/Profile');
const schedule = require('node-schedule');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errors');
const auth = require('./routes/auth');
const groupRouter = require('./routes/groupRouter');
const messageRouter = require('./routes/messageRouter');
const userRouter = require('./routes/userRouter');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('userRoom',(userId)=>{
    console.log(userId +"is in room")
    socket.join(userId);
    console.log('set user Room success ');
  });

  socket.on('joinGroup',(data)=>{
    socket.join(data);
    console.log(`joined group: ${data}`);
  });

  socket.on('send-message', (msg, sendLater, msgId) => {
    if (msg.users && msg.users.length > 0) { // Check if msg.users is defined and not empty
      if (sendLater === true) {
        schedule.scheduleJob(msg.sendLaterDate, function () {
          console.log("Message Received : ", msg, 'end');
          msg.users.forEach(user => {
            io.to(user).emit('receive-message', msg, sendLater, msgId);
            io.to(user).emit('receive-notif', msg);
          });
        });
      } else {
        // Broadcast the message to all specified users
        console.log("Message Received : ", msg, 'end');
        msg.users.forEach(user => {
          io.to(user).emit('receive-message', msg, sendLater, msgId);
          io.to(user).emit('receive-notif', msg, user);
        });
      }
    } else if (msg.userId) { // Handle user-to-user messages
      if (sendLater === true) {
        schedule.scheduleJob(msg.sendLaterDate, function () {
          console.log("Message Received : ", msg, 'end');
          io.to(msg.userId).emit('receive-message', msg, sendLater, msgId);
          io.to(msg.userId).emit('receive-notif', msg);
        });
      } else {
        // Broadcast the message to the specified user
        console.log("Message Received : ", msg, 'end');
        io.to(msg.userId).emit('receive-message', msg, sendLater, msgId);
        io.to(msg.userId).emit('receive-notif', msg);
      }
    } else {
      console.log("Error: msg.users is undefined or empty");
    }
  });
  
  

  // Cleanup on user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(bodyParser.json());

connectDB().then(r => console.log('DB connection successful!'));

app.use("/", newMessage);
app.use("/", Profile);

app.use('/api/v1', auth);
app.use(errorMiddleware);
app.use('/api/v1', groupRouter);
app.use('/api/v1', messageRouter);
app.use('/api/v1', userRouter);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
