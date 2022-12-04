const express = require("express");
var app = express();
const http = require("http");
let server = http.createServer(app);
let port = process.env.PORT || 3000;
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  }
});


const cors = require("cors");
app.use(cors());

io.on("connect", (socket) => {
  console.log(socket.id);
  socket.on("send-request", (request) => {
    io.emit("get-request", request);
    console.log(request);
  });
  socket.on("send-accept", (message, passenger, driver) => {
    io.to(passenger).emit("get-accept", driver);
    console.log(message);
  });

  socket.on("passenger-cancel-request", (driver) => {
    io.to(driver).emit("get-passenger-cancel-request");
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
  socket.on("driver-start-ride", (user) => {
    console.log(user);
    io.to(user).emit("get-start-ride");
    console.log("Ride started");
  });
});

server.listen(port, () => {
  console.log("listening on port " + port);
});
