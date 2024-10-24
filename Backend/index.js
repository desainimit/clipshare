const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ClipShare = require("./models/clipShare.modal.js");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const { log } = require("console");
const port = process.env.PORT || 8000;
const app = express();
app.use(
  cors({
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let ipAddress = "";
io.on("connection", (socket) => {
  ipAddress = socket.handshake.address;
  // console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  socket.on("joinroom", (room) => socket.join(room));

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("clipboardData", (data) => {
    console.log("Clipboard Data:", data);
    io.emit("clipboardData", data); // Broadcast clipboard data to all connected clients
  });
});

app.get("/", (req, res) => {
  res.send("socket chat BE started");
});

app.post("/save-clipboard", (req, res) => {
  try {
    const userIpAddress = ipAddress;
    const { clipData, roomId } = req.body;

    if (!clipData || !roomId) {
      return res.status(400).send("Required fields are missing");
    }
    const newClipBoardData = ClipShare.create({
      clipData,
      roomId,
      ipAddress: userIpAddress,
    });
    res.json({
      message: "Clipboard data saved successfully",
      newClipBoardData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to save clipboard data");
  }
});

app.get("/get-clipboard/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params; // Use req.params instead of req.query

    if (!roomId) {
      return res.status(400).send("Room ID is missing");
    }

    const clipBoardData = await ClipShare.find({ roomId });

    res.json(clipBoardData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to get clipboard data");
  }
});

server.listen(port, () => {
  console.log(`app started at port ${port}`);
});

// connect mongoDB
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to mongoDB");
});
