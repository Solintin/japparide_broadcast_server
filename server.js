const express = require("express");
var app = express();
let server = http.createServer(app);
const environment = process.env.NODE_ENV || "development";
let port = environment === "development" && 3000;
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
io.origins("*:*");
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
});

server.listen(port);
