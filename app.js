const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;
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
