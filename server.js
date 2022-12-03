const express = require("express");
var app = express();
const http = require("http");
let server = http.createServer(app);
let port = process.env.PORT || 3000;
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");
app.use(cors());

let users = [];
let drivers = [];
const addUsers = (newUser) => {
  const isExist = users.some((x) => x.userId === newUser.userId);
  console.log(isExist);
  if (!isExist) {
    users.push(newUser);
  }
  addDrivers();
  console.log(users);
};
const addDrivers = () => {
  const getDrivers = users.filter((x) => x.userType === "driver");
  // console.log(getDrivers);
  drivers = getDrivers;
};

io.on("connect", (socket) => {
  console.log(socket.id + " connected");
  socket.on("send-request", (request) => {
    //request.user = passenger
    console.log("All drivers ", drivers);
    io.to(request.user).emit("get-drivers", drivers);
    console.log("Request sent ", request);

    // io.emit("get-request", request);
    if (drivers.length > 0) {
      io.to(drivers[1].socket_id).emit("get-request", request);
    }
  });
  socket.on("send-user-info", (userInfo) => {
    const userData = {
      ...userInfo,
      socket_id: socket.id,
    };
    console.log(userData);
    addUsers(userData);
  });
  // socket.on("get-drivers", (passenger) => {
  //   io.to(passenger).emit("get-drivers", drivers);
  // });

  socket.on("send-accept", (message, passenger, driver) => {
    io.to(passenger).emit("get-accept", driver);
    console.log(message);
  });

  socket.on("passenger-cancel-request", (driver) => {
    io.to(driver).emit("get-passenger-cancel-request");
    console.log("Request Cancel from passenger");
  });
  socket.on("driver-cancel-request", (user, request) => {
    if (drivers.length > 0) {
      console.log("re-routing");
      console.log("re-routing-data ", request);
      io.to(drivers[Math.floor(Math.random() * 2)].socket_id).emit(
        "get-request",
        request
      );
    }
    // io.to(user).emit("get-driver-cancel-request");
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

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    const allUsers = users.filter((user) => user.socket_id !== socket.id);
    users = allUsers;
    addDrivers();
    console.log(users);
  });
});

server.listen(port, () => {
  console.log("listening on port " + port);
});
