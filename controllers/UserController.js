const User = require('../models/User')
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  const maxAge = 3 * 24 * 60 * 60;
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge
  })
}

const signup = async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    const userFoundUsername = await User.find({
      username
    })
    if(userFoundUsername.length !== 0) {
      return res.send(`User already exist with username ${username}`);
    }
    const userFoundEmail = await User.find({
      email
    })
    if(userFoundEmail.length !== 0) {
      return res.send(`User already exist with email ${email}`)
    }
    
    const newUser = new User({
      name,
      email,
      username,
      password
    })
    const savedUser = await newUser.save()

    return res.send(savedUser)
  } catch (err) {
    console.log(err)
  }
}

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    
  } catch (err) {

  }
}

module.exports = {
  signup
}