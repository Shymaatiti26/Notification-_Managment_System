const express = require('express');
const router = express.Router(); 
const {getMessage, sendMessages, getLatestMessage}= require('../controllers/messageController')

router.route('/getMessage').post(getMessage);
router.route('/sendMessages').post(sendMessages);
//router.route('/setLatestMessage').post(getLatestMessage)




module.exports=router;