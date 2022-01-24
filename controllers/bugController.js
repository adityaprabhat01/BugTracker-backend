const mongoose = require("mongoose");
const { Bug } = require("../models/Bug");
const { Project } = require("../models/Project");
const { UserCache } = require("../models/UserCache");
const { UserDetail } = require("../models/UserDetail");
const { isObjectEmpty } = require("../utils");

// Add a bug

const addBug = async (req, res) => {
  const { title, body, user, project_id } = req.body;
  try {
    // save new bug
    const newBug = new Bug({
      title,
      body,
      user,
      project_id,
    });
    const bug = await newBug.save();

    // update user cache
    const user_cache = await UserCache.findOne({ user_id: user.user_id });
    const { bugs } = user_cache;
    const bug_id = bug._id;
    bugs.push({ bug_id });
    user_cache.save();
    delete bugs;

    // Update Project model
    {
      const project = Project.findOne({ _id: project_id });
      const { bugs } = projects;
      const bug_id = bug._id;
      bugs.push({ bug_id });
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
        message: `${title} does not exist`,
      });
    }
    bug.body = body;
    const updatedBug = await bug.save();
    res.json(updatedBug);
  } catch (err) {
    return res.json({
      error: "Something went wrong",
    });
  }
};

// Add member to the bug

const addMemberBug = async (req, res) => {
  const { user_id, name, username, profileImageUrl, bug_id } = req.body;
  try {
    // Add member in the Bug model
    const bug = await Bug.findOne({ _id: bug_id });
    if (isObjectEmpty(bug)) {
      return res.json({
        message: `Bug does not exist`,
      });
    }
    const { members } = bug;
    const filtered_members = members.filter(
      (member) => member.user_id.toString() === user_id
    );
    if (filtered_members.length !== 0) {
      return res.json({
        message: `${username} is already a member in the bug`,
      });
    }
    const user_detail = await new UserDetail({
      name,
      username,
      user_id,
      profileImageUrl,
    });
    bug.members.push(user_detail);
    await bug.save();

    // update the UserCache model
    const user_cache = await UserCache.findOne({ user_id });
    const { bugs } = user_cache;
    const filtered_cache = bugs.filter((bug) => bug.project_id.toString() === bug_id);
    if (filtered_cache.length !== 0) {
      return res.json({
        message: `${username} is already a member in the bug`,
      });
    }
    const bug_id = bug._id;
    bugs.push({ bug_id });
    await user_cache.save();

    return res.json(bug);
  } catch (err) {
    console.log(err);
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
        message: `Bug does not exist`,
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
    const filtered_cache = bugs.filter(
      (bug) => bug.bug_id.toString() !== bug_id
    );
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
    const bug = await Bug.findOne({ _id: bug_id });
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
// Add populate method
const getBugsOfUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user_cache = await UserCache.findOne({ user_id }).populate('user_id');
    if (isObjectEmpty(user_cache)) {
      return res.json({
        message: "User does not exist",
      });
    }
    //const { bugs } = user_cache;
    console.log(user_cache)

    res.json(bugs);
  } catch (err) {
    return res.json({
      error: "Something went wrong",
    });
  }
};

module.exports = {
  addBug,
  updateBug,
  addMemberBug,
  removeMemberBug,
  getBug,
  getBugsOfUser,
};
