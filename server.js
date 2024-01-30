const Connection = require("./Config/db");
const UserRouter = require("./Routes/User.routes");

const express = require("express");
const cors = require("cors");
const path = require("path");
const AdminRouter = require("./Routes/Admin.routes");
require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "Frontend", "dist")));
app.use(express.json());


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
app.get("/*", (req, res) => {
  console.log(`Route Not Found /* - URL : ${req.url}`)
  res.setHeader("Content-Type", "text/html");
  res.redirect("http://localhost:3000");
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
