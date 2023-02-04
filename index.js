const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/UserModel");
const ChatsModel = require("./models/ChatModel");
const bodyParser = require("body-parser");
const cors = require("cors");
const { json } = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const multer = require("multer");
const fs = require("fs");
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const io = new Server(server, {
  cors: {
    origin: "https://chat.miratsoneservices.com/",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = [];

// Database Connection
mongoose.connect(
  "mongodb+srv://sagar:sai@cluster0.ycrzv.mongodb.net/comunication-channel?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const upload = multer({ dest: "uploads/" });

// Socket

io.on("connection", (socket) => {
  socket.on("setup", (loggedUser) => {
    console.log("User ID " + loggedUser._id + " Sokcet ID " + socket.id);
    socket.join(loggedUser._id);
    socket.emit("connected");
  });

  socket.on("send-message", (result) => {
    // console.log(result);
    socket.broadcast.emit("refect-data", () => {
      console.log("refetch!!!!");
    });
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
    // console.log(room);
  });
});

app.get("/api", (req, res) => {
  res.send("Server is running...");
});

app.post("/api/uploadFile", upload.single("avatar"), (req, res) => {
  console.log(req.body);

  let newFileName =
    req.file.filename + "." + req.file.originalname.split(".")[1];
  console.log(newFileName);

  fs.rename(
    `./uploads/${req.file.filename}`,
    `./uploads/${newFileName}`,
    (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("\nFile Renamed\n");
      }
    }
  );
  res.send("uploaded");
});

app.get("/api/getOnlineUsers", (req, res) => {
  res.send(onlineUsers);
});

app.get("/api/getAllUsers", async (req, res) => {
  await UserModel.find().then((result) => {
    res.send(result);
  });
});

app.post("/api/getUserByID", async (req, res) => {
  await UserModel.find({ _id: req.body.token }).then((result) => {
    res.send(result);
  });
});

app.post("/api/createUser", (req, res) => {
  let create = new UserModel(req.body);
  create.save().then((result) => res.send(result));
});

app.post("/api/login", async (req, res) => {
  await UserModel.find({ email: req.body.email }).then((result) => {
    res.send(result);
  });
});

app.get("/api/getAllChats", async (req, res) => {
  await ChatsModel.find().then((result) => {
    res.send(result);
  });
});

app.post("/api/findChatByID", (req, res) => {
  ChatsModel.find(req.body).then((result) => res.send(result));
});

app.post("/api/createNewChat", (req, res) => {
  // res.send(req.body);

  let create = new ChatsModel(req.body);
  create.save().then((result) => res.send(result));
});

app.post("/api/sendMessage", async (req, res) => {
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

app.get("/api/getAllMesaages", (req, res) => {
  MessagesModel.find().then((result) => {
    res.send(result);
  });
});

server.listen(3005, () => {
  console.log("Server is Running on port 3005");
});
