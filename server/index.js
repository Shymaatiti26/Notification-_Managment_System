const express =require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app=express()
const connectDB = require('./connectDB')
const loginRouter= require('./routes/loginRouter')
const signup= require('./routes/signupRouter')
const newMessage= require('./routes/NewMessageHandler')
const Profile=require('./routes/Profile')
app.use(cors())

//mongoose.connect("mongodb://127.0.0.1:27017/NotificationsSystem");

const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

connectDB().then(r => console.log('DB connection successful!'))

app.use("/",signup);
app.use("/",loginRouter);
app.use("/",newMessage);
app.use("/",Profile);

app.listen(3001, ()=>{
  console.log("server is running")
})
