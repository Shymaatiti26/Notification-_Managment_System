const mongoose =require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: false },
    senderName:{type: String},
    group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }],
    message: { type: String, required: true },
    timeSent: { type: String},
    sendLater: {type :String},
    groupName:{type: String}
    //seen: { type: Boolean, default: false }
  });

const MessageModel= mongoose.model("Message",messageSchema)

module.exports=MessageModel