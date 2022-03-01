const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser')


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

app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  console.log(req.headers.origin)
  next()
  
})
app.use(cookieParser());


app.use(
  cors({
    origin: ["https://focused-hugle-f9254e.netlify.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Failed to connect to database."));

app.use("", routes);

io.on("connection", (socket) => {
  socketCallback(socket);
});

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);

module.exports = {
  server,
};
