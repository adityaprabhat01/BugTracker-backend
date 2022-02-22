const mongoose = require("mongoose");
const { Bug } = require("../models/Bug");
const { Project } = require("../models/Project");
const { UserCache } = require("../models/UserCache");
const { UserDetail } = require("../models/UserDetail");
const { User } = require("../models/User");
const { isObjectEmpty } = require("../utils");

// Add a bug

const addBug = async (req, res) => {
  const { title, body, user, project_id } = req.body;
  const labels = [
    { name: "feature", assigned: false, _id: mongoose.Types.ObjectId(), color: "green" },
    { name: "bug", assigned: false, _id: mongoose.Types.ObjectId(), color: "red"},
    { name: "issue", assigned: false, _id: mongoose.Types.ObjectId(), color: "blue" }
  ]
  try {
    // save new bug
    const newBug = new Bug({
      title,
      body,
      user,
      project_id,
      isOpen: true,
      labels
    });
    const bug = await newBug.save();

    // update user cache
    const user_cache = await UserCache.findOne({ user_id: user.user_id });
    const { bugs } = user_cache;
    const bug_id = bug._id;
    bugs.push(bug_id);
    user_cache.save();

    // Update Project model
    {
      const project = await Project.findOne({ _id: project_id });
      const { bugs } = project;
      const bug_id = bug._id;
      bugs.push(bug_id);
      await project.save();
    }

    return res.json(bug);
  } catch (err) {
    return res.json({
      error: "Something went wrong",
    });
  }
};

// Update a bug

const updateBug = async (req, res) => {
  const { body, bug_id } = req.body;
  try {
    const bug = await Bug.findOne({ _id: bug_id });
    if (isObjectEmpty(bug)) {
      return res.json({
        message: "Bug does not exist",
      });
    }
    bug.body = body;
    const updatedBug = await bug.save();
    res.json({
      body: updateBug.body
    });
  } catch (err) {
    return res.json({
      error: "Something went wrong",
    });
  }
};

// Add member to the bug

const addMemberBug = async (req, res) => {
  const { username, bug_id } = req.body;
  try {
    // Add member in the Bug model
    const bug = await Bug.findOne({ _id: bug_id });
    if (isObjectEmpty(bug)) {
      return res.json({
        message: "Bug does not exist",
      });
    }

    const user = await User.findOne({ username });
    if (isObjectEmpty(user)) {
      return res.json({
        message: `User does not exist`,
      });
    }

    const { name } = user;

    const { members } = bug;
    const filtered_members = members.filter(
      (member) => member.user_id.toString() === user.id
    );
    if (filtered_members.length !== 0) {
      return res.json({
        message: `${username} is already a member in the bug`,
      });
    }

    const user_detail = await new UserDetail({
      name,
      username,
      user_id: user.id,
    });
    bug.members.push(user_detail);
    await bug.save();

    // update the UserCache model
    {
      const user_cache = await UserCache.findOne({ user_id: user.id });
      const { bugs } = user_cache;
      const filtered_cache = bugs.filter((bug) => bug.toString() === bug_id);
      if (filtered_cache.length !== 0) {
        return res.json({
          message: `${username} is already a member in the bug`,
        });
      }
      {
        const bug_id = bug._id;
        bugs.push(bug_id);
        await user_cache.save();
      }
      
    }

    return res.json(user_detail);
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Remove member from bug

const removeMemberBug = async (req, res) => {
  const { user_id, bug_id } = req.body;
  try {
    // Remove from bug model
    const bug = await Bug.findOne({ _id: bug_id });
    if (isObjectEmpty(bug)) {
      return res.json({
        message: "Bug does not exist",
      });
    }
    const { members } = bug;
    const filtered_members = members.filter(
      (member) => member.user_id.toString() !== user_id
    );
    bug.members = filtered_members;
    const updatedBug = await bug.save();

    // Update UserCache model
    const user_cache = await UserCache.findOne({ user_id });
    const { bugs } = user_cache;
    const filtered_cache = bugs.filter((bug) => bug.toString() !== bug_id);
    user_cache.bugs = filtered_cache;
    await user_cache.save();

    return res.json(updatedBug);
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Get bug

const getBug = async (req, res) => {
  const { bug_id } = req.params;
  try {
    const bug = await Bug.findOne({ _id: bug_id }).populate("comments");
    if (isObjectEmpty(bug)) {
      return res.json({
        message: "Bug does not exist",
      });
    }
    res.json(bug);
  } catch (err) {
    return res.json({
      error: "Something went wrong",
    });
  }
};

// Get all the bugs of user

const getBugsOfUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user_cache = await UserCache.findOne({ user_id }).populate("bugs");
    if (isObjectEmpty(user_cache)) {
      return res.json({
        message: "User does not exist",
      });
    }
    const { bugs } = user_cache;
    res.json(bugs);
  } catch (err) {
    return res.json({
      error: "Something went wrong",
    });
  }
};

// Close the bug

const closeBug = async (req, res) => {
  const { bug_id, user_id } = req.body;
  try {
    const bug = await Bug.findOne({ _id: bug_id });
    if (isObjectEmpty(bug)) {
      return res.json({
        message: "Bug does not exist",
      });
    }
    if (bug.user.user_id.toString() !== user_id) {
      return res.json({
        message: "User not authorized to close the bug",
      });
    }
    bug.isOpen = false;
    const updatedBug = await bug.save();
    res.json({
      isOpen: bug.isOpen
    });
  } catch (err) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const reopenBug = async (req, res) => {
  const { bug_id } = req.body;
  try {
    const bug = await Bug.findOne({ _id: bug_id });
    if (isObjectEmpty(bug)) {
      return res.json({
        message: "Bug does not exist",
      });
    }
    bug.isOpen = true;
    const updatedBug = await bug.save();
    res.json(updatedBug);
  } catch (err) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const updateLabel = async (req, res) => {
  const { bug_id, labels } = req.body;
  try {
    const bug = await Bug.findOne({ _id: bug_id });
    if (isObjectEmpty(bug)) {
      return res.json({
        message: "Bug does not exist",
      });
    }
    bug.labels = labels;
    await bug.save();
    res.json({
      labels
    })
  } catch(err) {
    res.json({
      error: "Something went wrong",
    });
  }
}

module.exports = {
  addBug,
  updateBug,
  addMemberBug,
  removeMemberBug,
  getBug,
  getBugsOfUser,
  closeBug,
  reopenBug,
  updateLabel
};
