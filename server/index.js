const express =require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const UsersModel = require('./models/User')
const jwt = require('jsonwebtoken');
const { useState } = require("react");

const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/NotificationsSystem");
//const username='lily'//to save the user name that have loged in


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
    /*
    const user = await UsersModel.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username: user.username }, 'secret_key');
      res.json({ success: true, message: 'Login successful', token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }*/
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
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

app.listen(3001, ()=>{
    console.log("server is running")
})