const express =require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const UsersModel = require('./models/User')

const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/NotificationsSystem");


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

app.listen(3001, ()=>{
    console.log("server is running")
})