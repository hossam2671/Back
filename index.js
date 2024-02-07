require("./config/connection");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

app.use(cors());
app.get("/", function (req, res) {
  res.send("Welcome");
});

app.use(express.static("images"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoute = require("./Routers/authRoute");
app.use("/auth", authRoute);

server.listen(5000, function () {
  console.log("listen");
});