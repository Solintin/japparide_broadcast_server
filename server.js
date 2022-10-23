const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080", "https://japparide.netlify.app/"],
    methods: ["GET", "POST"],
  },
});
const express = require("express");
const cors = require("cors");
express.use(cors());
// var clients = io.sockets.clients();

// console.log(clients);
// const sockets = (await io.fetchSockets()).map(socket => socket.id);
// console.log(sockets);
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
