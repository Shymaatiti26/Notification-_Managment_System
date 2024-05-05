const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const UserMessage =require('../models/UserMessages')
//const User= require('../models/User')

//send all user messages from db to front => api/v1/sendUserMessages
exports.sendUserMessages=catchAsyncErrors(async(req,res,next)=>{
    const adminId = req.body.adminId;
    const userId=req.body.userId;
    const messages = await UserMessage.find({   $or: [
        { adminId: adminId, userId: userId, sendLater: false },
        { adminId: userId, userId: adminId, sendLater: false }
      ] });
    // const messages = messagesData.map(message => message.message);
    console.log("tezeMessages",messages); 
    res.status(200).json({messages:messages})
});

//get message and save it on db => api/v1/getUserMessage
exports.getUserMessage=catchAsyncErrors(async(req,res,next)=>{
    const message = req.body.message;

    const msgObj= await UserMessage.create({  
    adminId:message.adminId ,
    adminName:message.adminName,
    userId:message.userId ,
    username:message.username,
    message: message.message,
    timeSent:message.timeSent,
    sendLater:message.sendLater,

    })  
    const messageId=msgObj._id;
    //console.log('msgId: '+messageId)
    res.json(messageId)

});

exports.setSenLaterToFalse =catchAsyncErrors(async(req,res,next)=>{
    try{
        
   const {msgId}= req.body;
   console.log('set sendLater succcess'+msgId);
   const msg= await UserMessage.findByIdAndUpdate(msgId,{sendLater: false},{new : true})
   res.status(200).json(msg);
   
    }catch(err){    console.log("error set sendLater to false".error);
}});

////////
exports.getScheduledMsgsForUser = catchAsyncErrors(async(req,res,next)=>{
    const userName=req.query.userName;
    const messages = await UserMessage.find({adminName:userName ,sendLater:true})
    //const messages = messagesData.map(username => username.username);
    res.status(200).json(messages)

});

