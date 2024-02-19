var express = require('express')
var router = express.Router();
const MessageModel= require('../models/Message')
const User= require('../models/User')
const nodemailer = require('nodemailer');

router.post('/api/messages', async (req, res) => {
    const { sender, recipients, message } = req.body;
  
    try {
      // Save message for each recipient
      const newMessage = new MessageModel({ sender, recipients, message });
      await newMessage.save();
  
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
//Create route to retrieve message history
router.get('/api/messages/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find messages sent to the user and those not seen yet
      const messages = await MessageModel.find({ recipients: userId, seen: false });
  
      res.json({ success: true, messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
// Backend API route to fetch all users
router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Assuming the "users" collection has a "username" field
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

  // POST endpoint to handle message sending
router.post('/MessageForm', async (req, res) => {
    const { message, recipients, sendEmail } = req.body;
  
    // Handle sending message via email if enabled
    if (sendEmail) {
      const transporter = nodemailer.createTransport({
        // Configure your email service provider here
        service: 'gmail',
        auth: {
          user: 'your_email@gmail.com',
          pass: 'your_password',
        },
      });
  
      const mailOptions = {
        from: 'no_reply@MessagesSystem.com',
        to: recipients.join(', '),
        subject: 'New Message',
        text: message,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).send('Error sending email');
        } else {
          console.log('Email sent:', info.response);
          res.send('Message sent successfully');
        }
      });
    } else {
      // Handle sending message via other means (e.g., messaging service)
      // This part is not implemented in this example
      console.log('Message sent:', message);
       MessageModel.create({
      message,
      recipients

    });
      res.send('Message sent successfully');
    }
   
  });
  
  module.exports = router;