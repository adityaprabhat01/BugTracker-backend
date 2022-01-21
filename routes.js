const express = require("express");
const { signup, login, logout } = require("./controllers/UserController");

const router = express.Router();

// User Controller
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
