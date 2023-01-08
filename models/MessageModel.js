const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    message: String,
  },

  { timestaps: true }
);

const Messages = mongoose.model("Messages", MessagesSchema);

module.exports = Messages;
