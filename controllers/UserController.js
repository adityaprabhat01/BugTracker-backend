const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const { isObjectEmpty } = require("../utils");
const { UserCache } = require("../models/UserCache");
const { Notification } = require("../models/Notification");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
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

    const newUserCache = new UserCache({
      user_id: user._id,
      username,
    });
    const cached = await newUserCache.save();

    const newNotification = new Notification({
      user_id: user._id,
      name: user.name,
      username: user.username,
      notifications: [],
      count: 0
    });
    await newNotification.save();

    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: true,
      sameSite: "None",
      //domain: req.headers.origin
    });
    // res.cookie("username", user.username, {
    //   maxAge: maxAge * 1000,
    //   secure: true,
    //   sameSite: "None",
    //   //domain: req.headers.origin
    // });
    // res.cookie("user_id", user.id, {
    //   maxAge: maxAge * 1000,
    //   secure: true,
    //   sameSite: "None",
    //   //domain: req.headers.origin
    // });
    // res.cookie("name", user.name, {
    //   maxAge: maxAge * 1000,
    //   secure: true,
    //   sameSite: "None",
    //   //domain: req.headers.origin
    // });
    return res.status(201).json({
      user_id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      jwt: token
    });
  } catch (err) {
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
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        secure: true,
        sameSite: "None",
        //domain: req.headers.origin
      });
      // res.cookie("username", user.username, {
      //   maxAge: maxAge * 1000,
      //   secure: true,
      //   sameSite: "None",
      //   //domain: req.headers.origin
      // });
      // res.cookie("user_id", user.id, {
      //   maxAge: maxAge * 1000,
      //   secure: true,
      //   sameSite: "None",
      //   //domain: req.headers.origin
      // });
      // res.cookie("name", user.name, {
      //   maxAge: maxAge * 1000,
      //   secure: true,
      //   sameSite: "None",
      //   //domain: req.headers.origin
      // });
      return res.status(201).json({
        user_id: user._id,
        name: user.name,
        username: user.username,
        jwt: token
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

// get user
const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.json({
        message: "User does not exist",
      });
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// get user cache
const getUserCache = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserCache.findOne({ username })
      .populate("projects")
      .populate("bugs");
    if (!user) {
      res.json({
        message: "User does not exist",
      });
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getUser,
  getUserCache,
};
