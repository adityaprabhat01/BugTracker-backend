const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();
const cors = require("cors")

const routes = require("./routes");
const { socketCallback } = require("./socket");

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors({
  origin : 'http://localhost:3000',
  credentials: true,
}))

app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(express.json());


mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Failed to connect to database."));

app.use("", routes);

io.on("connection", (socket) => { socketCallback(socket) })

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);

module.exports = {
  server
}