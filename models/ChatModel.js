const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    groupChat: {
      type: Boolean,
    },
    users: {
      type: Array,
    },
    groupName: {
      type: String,
    },
    messages: {
      type: Array,
    },
    members: {
      type: Array,
    },
    admin: String,
  },

  { timestaps: true }
);

const Chats = mongoose.model("Chats", ChatSchema);

module.exports = Chats;
