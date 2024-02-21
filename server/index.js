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
const chat=require('./routes/chatRouter')
const app=express()
//app.use(cors())
const http = require('http');
const socketIo = require('socket.io');

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
////

//const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

connectDB().then(r => console.log('DB connection successful!'))

app.use("/",signup);
app.use("/",loginRouter);
app.use("/",newMessage);
app.use("/",chat);


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);

})

/*
app.listen(3001, ()=>{
  console.log("server is running")
})*/
// app.post('/signup',async(req,res)=>{
//     const formData = req.body.formData;
//   try{
//      // Check if the username already exists
//      const ExistingUser=await UsersModel.findOne({username:formData.username});
//     if(ExistingUser){
//         return res.json({success:false, message:'Username already exists' } )
//     }
//    // Username doesn't exist, create a new user
//     UsersModel.create(formData)
//     res.json({ success: true, message: 'User registered successfully' });

//     }catch (error) {
//     console.error('Error during signup:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error', error: error });
//   }
 
// })

// // Login route
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user =await UsersModel.findOne({username:username})
//     const userP=await UsersModel.findOne({password:password})
//     if(user){
//       if (userP) {
//         res.json({ success: true, message: 'Login successful' });
//       }else{
//         res.json({ success: false, message: 'Wrong password' });
//       }

//     }else {
//       res.json({ success: false, message: "No such user" })

//     }
//     /*
//     const user = await UsersModel.findOne({ username, password });
//     if (user) {
//       const token = jwt.sign({ username: user.username }, 'secret_key');
//       res.json({ success: true, message: 'Login successful', token });
//     } else {
//       res.status(401).json({ success: false, message: 'Invalid username or password' });
//     }*/
//   } catch (err) {
//     console.error('Error during login:', err.message);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // POST endpoint to handle message sending
// app.post('/MessageForm', async (req, res) => {
//   const { message, recipients, sendEmail } = req.body;

//   // Handle sending message via email if enabled
//   if (sendEmail) {
//     const transporter = nodemailer.createTransport({
//       // Configure your email service provider here
//       service: 'gmail',
//       auth: {
//         user: 'your_email@gmail.com',
//         pass: 'your_password',
//       },
//     });

//     const mailOptions = {
//       from: 'your_email@gmail.com',
//       to: recipients.join(', '),
//       subject: 'New Message',
//       text: message,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error sending email');
//       } else {
//         console.log('Email sent:', info.response);
//         res.send('Message sent successfully');
//       }
//     });
//   } else {
//     // Handle sending message via other means (e.g., messaging service)
//     // This part is not implemented in this example
//     console.log('Message sent:', message);
//     res.send('Message sent successfully');
//   }
//   MessageModel.create(req.body);
// });