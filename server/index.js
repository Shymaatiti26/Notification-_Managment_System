const express =require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const UsersModel = require('./models/User')

const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/NotificationsSystem");


app.post('/signup',(req,res)=>{
    const formData = req.body.formData;

    // 'formData' contains the data sent from the client
   // console.log(formData);
  
    // Add your registration logic here
    UsersModel.create(formData)
    .then(user =>res.json(user))
    .catch(err=> res.json(err))
    // Respond to the client (this is just an example response)
   // res.json({ success: true, message: 'User registered successfully' });
})

app.listen(3001, ()=>{
    console.log("server is running")
})