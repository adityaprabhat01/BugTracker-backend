const express = require('express');
const { signup } = require('./controllers/UserController');

const router = express.Router()

// User Controller
router.post('/signup', signup);

module.exports = router