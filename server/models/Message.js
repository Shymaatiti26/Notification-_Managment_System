const mongoose =require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: false },
    group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    message: { type: String, required: true },
    timeSent: { type: String},
    sendLater: {type :String},
    //seen: { type: Boolean, default: false }
  });

const MessageModel= mongoose.model("Message",messageSchema)

module.exports=MessageModel