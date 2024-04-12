const express =require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const connectDB = require('./connectDB')
const loginRouter= require('./routes/loginRouter')
const signup= require('./routes/signupRouter')
const newMessage= require('./routes/NewMessageHandler')
//const chat=require('./routes/chatRouter')
const app=express()
//app.use(cors())
const http = require('http');
const socketIo = require('socket.io');
const Profile=require('./routes/Profile')
const schedule = require('node-schedule');

//new changes 
const cookieParser = require('cookie-parser')
const errorMiddleware= require('./middlewares/errors')
const auth= require('./routes/auth')
const groupRouter=require('./routes/groupRouter')
const messageRouter=require('./routes/messageRouter')
//const task = require('./scheduleTasks');

app.use(express.json())
app.use(cookieParser())


//////// end new changes



////
// Use http.createServer to create a server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

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

  socket.on('userRoom',(userId)=>{
    socket.join(userId)
    console.log('set user Room success ')

  })

  socket.on('joinGroup',(data)=>{
    socket.join(data);
    console.log(`joined group: ${data}`)

  })

  // Listen for incoming chat messages
  socket.on('send-message', (msg,sendLater) => {

    if(sendLater===true){
    schedule.scheduleJob(msg.sendLaterDate, function(){
      console.log("Message Received : ",msg,'end')
      io.to(msg.groupId).emit('receive-message', msg,sendLater);
      msg.users.forEach(user => {
        socket.in(user.id).emit('receive-notif', msg)
      });
      
    });}else{
   
    // Broadcast the message to all connected clients
    console.log("Message Received : ",msg,'end')
    io.to(msg.groupId).emit('receive-message', msg,sendLater);
    msg.users.forEach(user => {
      socket.in(user.id).emit('receive-notif', msg)
    });
  }
  });



  // Cleanup on user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
////

//const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

connectDB().then(r => console.log('DB connection successful!'))

// app.use("/",signup);
// app.use("/",loginRouter);
app.use("/",newMessage);
//app.use("/",chat);
app.use("/",Profile);


app.use('/api/v1',auth);
app.use(errorMiddleware)
app.use('/api/v1',groupRouter)
app.use('/api/v1',messageRouter)



const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);

})
