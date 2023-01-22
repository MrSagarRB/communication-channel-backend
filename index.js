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

const onlineUsers = [];

// Database Connection
mongoose.connect(
  "mongodb+srv://sagar:sai@cluster0.ycrzv.mongodb.net/comunication-channel?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

// Socket
const io = require("socket.io")(8900, {
  cors: {
    origin: "https://communication-channel2.vercel.app",
  },
});

io.on("connection", (socket) => {
  //when ceonnect

  socket.on("user_online", (data) => {
    if (onlineUsers.includes(data)) {
    } else {
      onlineUsers.push(data);
    }
  });

  socket.on("sendMsg", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_msg", data);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.get("/getOnlineUsers", (req, res) => {
  res.send(onlineUsers);
});

app.get("/getAllUser", async (req, res) => {
  await UserModel.find().then((result) => {
    res.send(result);
  });
});

app.post("/getUserByID", async (req, res) => {
  await UserModel.find({ _id: req.body.token }).then((result) => {
    res.send(result);
  });
});

app.post("/createUser", (req, res) => {
  let create = new UserModel(req.body);
  create.save().then((result) => res.send(result));
});

app.post("/login", async (req, res) => {
  await UserModel.find({ email: req.body.email }).then((result) => {
    res.send(result);
  });
});

app.get("/getAllChats", async (req, res) => {
  await ChatsModel.find().then((result) => {
    res.send(result);
  });
});

app.post("/findChatByID", (req, res) => {
  ChatsModel.find(req.body).then((result) => res.send(result));
});

app.post("/createNewChat", (req, res) => {
  // res.send(req.body);

  let create = new ChatsModel(req.body);
  create.save().then((result) => res.send(result));
});

app.post("/sendMessage", async (req, res) => {
  await ChatsModel.updateOne(
    { _id: req.body.id },
    {
      $push: {
        messages: {
          text: req.body.message,
          senderId: req.body.senderID,
          time: req.body.time,
        },
      },
    }
  );

  res.send(req.body);
});

app.get("/getAllMesaages", (req, res) => {
  MessagesModel.find().then((result) => {
    res.send(result);
  });
});

app.listen(3005, () => {
  console.log("Server is Running on port 3005");
});
