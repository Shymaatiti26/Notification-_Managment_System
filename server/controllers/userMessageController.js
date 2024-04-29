const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const UserMessage =require('../models/UserMessages')
//const User= require('../models/User')

//send all user messages from db to front => api/v1/sendUserMessages
exports.sendUserMessages=catchAsyncErrors(async(req,res,next)=>{
    const adminId = req.body.adminId;
    const userId=req.body.userId;
    const messages = await UserMessage.find({ adminId: adminId, user: userId, sendLater: false });
    //console.log(messages)
    res.status(200).json({messages:messages})
});

//get message and save it on db => api/v1/getUserMessage
exports.getUserMessage=catchAsyncErrors(async(req,res,next)=>{
    const message = req.body.message;

    const msgObj= await UserMessage.create({  
    adminId:message.adminId ,
    adminName:message.adminName,
    user:message.user ,
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
exports.getScheduledMsgs = catchAsyncErrors(async(req,res,next)=>{
    const adminName=req.query.adminName;
    const messages = await UserMessage.find({adminName:adminName ,sendLater:true}).populate({
        path: 'group',
        select: 'adminName' // Select the fields you want to populate from the 'group' model
    });
    res.status(200).json(messages)

});