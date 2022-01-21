const express = require('express');
const { signup, login } = require('./controllers/UserController');

const router = express.Router()

// User Controller
router.post('/signup', signup);
router.post('/login', login)

module.exports = router