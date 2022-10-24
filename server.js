const io = require("socket.io")(3000, {
  cors: {
    // origin: ["http://localhost:8080", "https://japparide.netlify.app/"],
    origins: ["*"],
    handlePreflightRequestght: (req, res) => {
      res.writtenHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "GET, POST",
        "Access-Control-Allow-Methods": "my-custom-header",
        "Access-Control-Allow-Credentials": true,
      });
      res.end()
    },
  },
});
const express = require("express");
const cors = require("cors");
var app = express();

app.use(cors());

io.on("connect", (socket) => {
  console.log(socket.id);
  socket.on("send-request", (request) => {
    io.emit("get-request", request);
    console.log(request);
  });
  socket.on("send-accept", (message, passenger) => {
    io.to(passenger).emit("get-accept", message);
    console.log(message);
  });
});
