// Login route
var express = require('express')
var router = express.Router();
const cors = require("cors")
const UsersModel = require('../models/User')
const app=express()
app.use(express.json())
app.use(cors())

router.post('/login', async (req, res) => {
    const { username, EnteredPassword } = req.body;
  
    try {
      const user =await UsersModel.findOne({username:username})
      const password=user.password;
      if(!user){
          res.json({ success: false, message: "No such user" });
        }
      else {
        if(password===EnteredPassword)
        {
          res.status(200).json({ success: true, message: "login successfully" });
        }
        else
        {
          res.json({ success: false, message: 'Wrong username or password' });
        }
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

  module.exports = router;
  