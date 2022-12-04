const express = require("express");
var app = express();
const http = require("http");
let httpServer = http.createServer(app);
let port = process.env.PORT || 3000;
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const cors = require("cors");
app.use(cors());

// alert(calcCrow(59.3293371,13.4877472,59.3225525,13.4619422).toFixed(1));
//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2, idx) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  console.log(d, `D${idx}`);
  return d;
}
// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}
let users = [];
let drivers = [];
let distanceGenerator = [];
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

    //calcualte distance
    drivers.forEach(function (driver, idx) {
      const distance = calcCrow(
        driver.driverLat,
        driver.driverLon,
        request.data.passengerPickupLatLon.lat,
        request.data.passengerPickupLatLon.lon,
        idx + 1
      );
      distanceGenerator.push({ distance: distance, idx: idx });
      console.log(distanceGenerator);
    });

    // io.emit("get-request", request);
    if (drivers.length > 0) {
      //get nearest driverID on first search
      const { idx } = distanceGenerator.reduce(function (prev, curr) {
        return prev.distance < curr.distance ? prev : curr;
      });
      io.to(drivers[idx].socket_id).emit("get-request", request);
      //empty the array after choosing nearest driver
      distanceGenerator = [];
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
    //Re-route cancelled request to another Driver
    if (drivers.length > 0) {
      console.log("re-routing");
      console.log("re-routing-data ", request);
      let randomDriverId = Math.floor(Math.random() * drivers.length - 1);
      //controls negative Index
      if (randomDriverId < 0) {
        randomDriverId = randomDriverId * -1;
      }
      console.log(randomDriverId);
      console.log(drivers.length);
      io.to(drivers[randomDriverId].socket_id).emit("get-request", request);
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

app.get("/", (req, res) => {
  res.send("hello");
});

httpServer.listen(port, () => {
  console.log("listening on port " + port);
});
