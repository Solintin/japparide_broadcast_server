const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    // origin: ['http://localhost:8080', 'https://japparide.netlify.app'],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  console.log("a user connected");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});