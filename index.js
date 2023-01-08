const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/UserModel");
const ChatsModel = require("./models/ChatModel");
const MessagesModel = require("./models/MessageModel");
const bodyParser = require("body-parser");
const cors = require("cors");
const { json } = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose.connect(
  "mongodb+srv://sagar:sai@cluster0.ycrzv.mongodb.net/comunication-channel?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.get("/getAllUser", (req, res) => {
  UserModel.find().then((result) => {
    res.send(result);
  });
});

app.post("/createUser", (req, res) => {
  let create = new UserModel(req.body);
  create.save().then((result) => res.send(result));
});

app.get("/getAllChats", (req, res) => {
  ChatsModel.find().then((result) => {
    res.send(result);
  });
});

app.post("/createNewChat", (req, res) => {
  let create = new ChatsModel(req.body);
  create.save().then((result) => res.send(result));
});

app.post("/sendMessage", (req, res) => {
  let create = new MessagesModel(req.body);
  create.save().then((result) => {
    res.send(result);
  });

  console.log(req.body);
});

app.get("/getAllMesaages", (req, res) => {
  MessagesModel.find().then((result) => {
    res.send(result);
  });
});

app.listen(3005, () => {
  console.log("Server is Running on port 3000");
});
