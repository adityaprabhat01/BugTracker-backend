const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const { isObjectEmpty } = require("../utils");
const { UserCache } = require("../models/UserCache");

const createToken = (id) => {
  const maxAge = 3 * 24 * 60 * 60;
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};

// Sign up user

const signup = async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    const userFoundUsername = await User.find({
      username,
    });
    if (!isObjectEmpty(userFoundUsername)) {
      return res.send({
        message: `User already exist with username ${username}`,
      });
    }
    const userFoundEmail = await User.find({
      email,
    });
    if (!isObjectEmpty(userFoundEmail)) {
      return res.send({
        message: `User already exist with email ${email}`,
      });
    }

    const newUser = new User({
      name,
      email,
      username,
      password,
    });
    const user = await newUser.save();
    console.log(user.id)

    const newUserCache = new UserCache({
      user_id: user._id
    })
    const cached = await newUserCache.save();    

    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.cookie("username", user.username, { httpOnly: true });
    return res.status(201).json({
      user_id: user._id,
      name: user.name,
      username: user.username,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Log in user

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (isObjectEmpty(user)) {
      return res.send(`User not found`);
    }
    const authenticated = await user.isValidPassword(password);
    if (authenticated) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true });
      res.cookie("username", user.username, { httpOnly: true });
      return res.status(201).json({
        user_id: user._id,
        name: user.name,
        username: user.username,
      });
    } else {
      res.send({
        message: "Incorrect password",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Log out user

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("username", "", { maxAge: 1 });
  res.send({
    redirect: true,
  });
};

module.exports = {
  signup,
  login,
  logout,
};
