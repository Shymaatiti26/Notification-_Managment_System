const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    muteOnUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    Messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    groupAdmin: [
      {
        type: String,
        ref: "User",
      },
    ],
    latestMessage: { type: String },
    latestMessageTime: { type: String },

    groupSenders: { type: Boolean },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
