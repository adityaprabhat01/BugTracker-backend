const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors")

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

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

const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);
