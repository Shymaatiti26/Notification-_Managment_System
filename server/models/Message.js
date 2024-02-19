const mongoose =require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    message: { type: String, required: true },
    timeSent: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false }
  });

const MessageModel= mongoose.model("Message",messageSchema)

module.exports=MessageModel