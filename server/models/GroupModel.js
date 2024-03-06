const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({

    groupName:{type:String},

    users:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"


        }],

    Messages:[{
            type: mongoose.Schema.Types.ObjectId,  
            ref:"Message"
        }],

    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    latestMessage:{type:String}

},
{timestamps: true}
);

const  Group = mongoose.model("Group",groupSchema);
module.exports = Group;