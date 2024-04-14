const express = require('express');
const router = express.Router(); 
const {getMessage, sendMessages, getLatestMessage,getScheduledMsgs,setSenLaterToFalse}= require('../controllers/messageController')

router.route('/getMessage').post(getMessage);
router.route('/sendMessages').post(sendMessages);
//router.route('/setLatestMessage').post(getLatestMessage)
router.route('/getScheduledMsgs').get(getScheduledMsgs);
router.route('/setSenLaterToFalse').post(setSenLaterToFalse);




module.exports=router;