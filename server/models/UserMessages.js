const mongoose =require('mongoose')

//const { followedUserSchema } = require('./userSchema');
const usermessageSchema = new mongoose.Schema({
    adminId: { type: String, required: false },
    adminName: { type: String, required: false },
    userId: { type: String, required: false },
    username: { type: String, required: false },
    message: { type: String, required: true },
    timeSent: { type: String},
    sendLater: {type :String},
    //seen: { type: Boolean, default: false }
  });

const UserMessageModel= mongoose.model("UserMessage",usermessageSchema)

module.exports=UserMessageModel

