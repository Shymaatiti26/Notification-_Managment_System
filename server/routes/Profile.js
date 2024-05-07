// Login route
var express = require('express')
var router = express.Router();
const cors = require("cors")
const UsersModel = require('../models/User')
const app=express()
app.use(express.json())
app.use(cors())

// Assuming you have necessary imports and setup for Express and database connection

//const express = require('express');
//const router = express.Router();

//const User = require('../models/User'); // Assuming you have a User model

// Route to fetch user profile
router.get('/profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await UsersModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Route to update user profile
  router.put('/profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const updatedUserData = req.body;
      const updatedUser = await UsersModel.findById(userId);
      await updatedUser.save({
          new:true,
          updatedUserData
      })
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  module.exports=router;