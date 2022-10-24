const express = require("express");
var app = express();
let server = http.createServer(app);

const io = require("socket.io")(server, 
  {
  cors: {
    // origin: ["http://localhost:8080", "https://japparide.netlify.app/"],
    origin: ["*"],
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
}
);
io.set('origins', "*")
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

app.listen(3000)
