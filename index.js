const express = require('express');
// const socketIO = require('socket.io');
var app = express();
require('dotenv').config()
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

app.use('/', (req, res) => res.send("Hello Websocket"))
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// const io = socketIO(server,  {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],  
//   },
// });

// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);