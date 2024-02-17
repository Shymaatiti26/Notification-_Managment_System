const express =require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const UsersModel = require('./models/User')
const jwt = require('jsonwebtoken');
//import Chat from "./chat";
const http = require('http');
const socketIo = require('socket.io');
const app=express()
app.use(express.json())

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

mongoose.connect("mongodb://127.0.0.1:27017/NotificationsSystem");


// Use http.createServer to create a server
const server = http.createServer(app);

 // Initialize Socket.IO with the server
 const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Replace with your React app's URL
    methods: ['GET', 'POST'],
  },
});

//signup route
app.post('/signup',async(req,res)=>{
    const formData = req.body.formData;
  try{
     // Check if the username already exists
     const ExistingUser=await UsersModel.findOne({username:formData.username});
    if(ExistingUser){
        return res.json({success:false, message:'Username already exists' } )
    }
   // Username doesn't exist, create a new user
    UsersModel.create(formData)
    res.json({ success: true, message: 'User registered successfully' });

    }catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error });
  }
 
})

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user =await UsersModel.findOne({username:username})
    const userP=await UsersModel.findOne({password:password})
    if(user){
      if (userP) {
        res.json({ success: true, message: 'Login successful' });
      }else{
        res.json({ success: false, message: 'Wrong password' });
      }

    }else {
      res.json({ success: false, message: "No such user" })

    }
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
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

/*
app.post('/UserPage',async(req,res)=>{
  try{
  res.json({username:username})
  }catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
  

});
*/

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);

})