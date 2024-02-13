const Connection = require("./Config/db");
const UserRouter = require("./Routes/User.routes");
const AdminRouter = require("./Routes/Admin.routes");

require("dotenv").config();
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");

const app = express();

app.use(express.json())
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());


io.on('connection', (socket) => {
  console.log('A user connected');


  socket.on('offer', (offer, targetSocketId) => {
    // Broadcast the offer to the target client
    io.to(targetSocketId).emit('offer', offer, socket.id);
  });

  socket.on('answer', (answer, targetSocketId) => {
    // Broadcast the answer to the target client
    io.to(targetSocketId).emit('answer', answer, socket.id);
  });

  socket.on('ice-candidate', (candidate, targetSocketId) => {
    // Broadcast the ICE candidate to the target client
    io.to(targetSocketId).emit('ice-candidate', candidate, socket.id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


app.use("/user", UserRouter)
app.use("/admin", AdminRouter)


app.get("/", (req, res) => {
  try {
    res.status(200).send({ message: "Welcome to Meeting App" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message || "Something Went Wrong" })
  }
});

//? HTML Request
// Exclude /socket.io/ from generic route handler
app.get(/^(?!\/socket\.io\/).*/, (req, res) => {
  console.log(`Route Not Found - URL : ${req.url}`);
  res.setHeader("Content-Type", "text/html");
  res.status(404).send("Path Not Found" + ` ${req.url}`);
});


const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  try {
    await Connection;
    console.log("Database Connected");
  } catch (err) {
    console.log("Error connecting to DB");
  }
  console.log(`Server PORT : http://localhost:${PORT}`);
});
