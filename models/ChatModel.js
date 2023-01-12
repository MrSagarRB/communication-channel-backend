const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    users: {
      type: Array,
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
