'use strict';

const express = require('express');
const socketIO = require('socket.io');
var app = express();

const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: false,
  })
);
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.send("Hello Websocket"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server,  {
  cors: {
    origin: "*",
    
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);