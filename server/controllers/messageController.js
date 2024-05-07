const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Message =require('../models/Message')


//get message and save it on db => api/v1/getMessage
exports.getMessage=catchAsyncErrors(async(req,res,next)=>{
    const message = req.body.message;

    const msgObj= await Message.create({  
    sender:message.sender ,
    group:message.groupId ,
    message: message.message,
    timeSent:message.timeSent,
    sendLater:message.sendLater,

    })  
    const messageId=msgObj._id;
    //console.log('msgId: '+messageId)
    res.json(messageId)


});

//send all group messages from db to front => api/v1/
exports.sendMessages=catchAsyncErrors(async(req,res,next)=>{
    const groupId = req.body.groupId
    const messages = await Message.find({group:groupId,sendLater:false}) 
    //console.log(messages)
    res.status(200).json({messages:messages})




});

exports.getScheduledMsgs = catchAsyncErrors(async(req,res,next)=>{
    const userName=req.query.userName;
    const messages = await Message.find({sender:userName ,sendLater:true}).populate({
        path: 'group',
        select: 'groupName' // Select the fields you want to populate from the 'group' model
    });
    res.status(200).json(messages)

});

exports.setSenLaterToFalse =catchAsyncErrors(async(req,res,next)=>{
    try{
        
   const {msgId}= req.body;
   console.log('set sendLater succcess'+msgId);
   const msg= await Message.findByIdAndUpdate(msgId,{sendLater: false},{new : true})
   res.status(200).json(msg);
   
    }catch(err){    console.log("error set sendLater to false".error);
}
        


});

/*
//get latest message from db => api/v1/getLatestMessage
exports.setLatestMessage=catchAsyncErrors(async(req,res,next)=>{
    try {
    const groupId = req.body.groupId
    const latestMessage = await Message.findOne({group:groupId}).sort({createdAt: -1}) 
    }catch(error){
        console.log('error get latest message:'.error)
        next(error)
    }

});
*/