const { Project } = require("../models/Project");
const { ProjectDetail } = require("../models/ProjectDetail");
const { UserCache } = require("../models/UserCache");
const { UserDetail } = require("../models/UserDetail");
const { isObjectEmpty } = require("../utils");

// Create a new project

const addProject = async (req, res) => {
  const { title, user, details } = req.body;
  try {
    const newProject = new Project({
      title,
      user,
      details,
    });
    const project = await newProject.save();

    const user_cache = await UserCache.findOne({ user_id: user.user_id });
    const { projects } = user_cache;
    const project_detail = new ProjectDetail({
      project_id: project._id,
      title: project.title,
      dateCreated: project.dateCreated,
      details: project.details,
    });
    projects.push(project_detail);
    await user_cache.save();

    return res.status(200).json(project);
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Delete a project
// COMPLICATED DON'T USE FOR NOW
const deleteProject = async (req, res) => {
  const { _id, title, user_id } = req.body;
  try {
    const project = await Project.findOne({ _id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project ${title} does not exist`,
      });
    }
    Project.findOneAndDelete({ _id }, function (err, result) {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        return res.json({
          message: `Project ${result.title} deleted sucessfully`,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Update title, details, techStack

const updateProject = async (req, res) => {
  const { _id, title, details, techStack } = req.body;
  try {
    const project = await Project.findOne({ _id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project ${title} does not exist`,
      });
    }
    const updatedProject = await Project.findOneAndUpdate(
      { _id },
      { title, details, techStack },
      { new: true }
    );
    if (isObjectEmpty(updatedProject)) {
      res.status(500).json({
        error: "Something went wrong",
      });
    } else {
      return res.json(updatedProject);
    }
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Add members into project

const addMembers = async (req, res) => {
  const { user_id, name, username, profileImageUrl, project_id, title } =
    req.body;
  try {
    const project = await Project.findOne({ _id: project_id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project ${title} does not exist`,
      });
    }
    const { members } = project;
    const filtered = members.filter(
      (member) => member.user_id.toString() === user_id
    );
    if (filtered.length !== 0) {
      return res.json({
        message: `${username} is already present in the project`,
      });
    }
    const user_detail = await new UserDetail({
      name,
      username,
      user_id,
      profileImageUrl,
    });
    project.members.push(user_detail);
    await project.save();

    const user_cache = await UserCache.findOne({ user_id });
    const { projects } = user_cache;
    const check = projects.filter(
      (project) => project.project_id.toString() === project_id
    );
    if (check.length !== 0) {
      return res.json({
        message: `${username} is already present in the project`,
      });
    }
    const project_detail = new ProjectDetail({
      project_id: project._id,
      title: project.title,
      dateCreated: project.dateCreated,
      details: project.details,
    });
    projects.push(project_detail);
    await user_cache.save();
    return res.json(project);
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Remove member from project

const removeMember = async (req, res) => {
  const { user_id, project_id, title } = req.body;
  try {
    const project = await Project.findOne({ _id: project_id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project ${title} does not exist`,
      });
    }
    const { members } = project;

    const filtered_members = members.filter(
      (member) => member.user_id.toString() !== user_id
    );
    project.members = filtered_members;
    const updatedProject = await project.save();

    const user_cache = await UserCache.findOne({ user_id });
    const { projects } = user_cache;
    const filtered_projects = projects.filter(
      (project) => project.project_id !== project_id
    );
    user_cache.projects = filtered_projects;
    await user_cache.save();

    return res.json(updatedProject);
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Get project

const getProject = async (req, res) => {
  const { project_id } = req.params;
  try {
    const project = await Project.findOne({ _id: project_id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project does not exist`,
      });
    }
    res.json(project);
  } catch (err) {
    return res.json({
      error: "Something went wrong",
    });
  }
};

// Get projects of a user

const getProjectsOfUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user_cache = await UserCache.findOne({ user_id });
    if (isObjectEmpty(user_cache)) {
      return res.json({
        message: "User does not exist",
      });
    }
    const { projects } = user_cache;
    res.json(projects);
  } catch (err) {
    return res.json({
      error: "Something went wrong",
    });
  }
};

module.exports = {
  addProject,
  deleteProject,
  updateProject,
  addMembers,
  removeMember,
  getProject,
  getProjectsOfUser,
};
