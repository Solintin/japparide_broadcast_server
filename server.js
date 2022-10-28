const express = require("express");
var app = express();
const http = require("http");
let server = http.createServer(app);
const environment = process.env.NODE_ENV || "development";
let port = environment === "development" && 3000;
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");
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

  socket.on("passenger-cancel-request", () => {
    io.emit("get-passenger-cancel-request");
    console.log("Request Cancel from passenger");
  });
  socket.on("driver-cancel-request", (user) => {
    io.to(user).emit("get-driver-cancel-request");
    console.log("Request Cancel from driver");
  });
  socket.on("ride-completed", (user) => {
    console.log(user);
    io.to(user).emit("get-ride-completed");
    console.log("Ride Completed");
  });
});

server.listen(port, () => {
  console.log("listening on port " + port);
});
