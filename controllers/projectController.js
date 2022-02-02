const mongoose = require("mongoose");
const { Project } = require("../models/Project");
const { UserCache } = require("../models/UserCache");
const { User } = require("../models/User");
const { UserDetail } = require("../models/UserDetail");
const { isObjectEmpty } = require("../utils");

// Create a new project

const addProject = async (req, res) => {
  const { title, user, body } = req.body;
  try {
    // Add new project
    const newProject = new Project({
      title,
      user,
      body,
    });
    const project = await newProject.save();

    // Update UserCache model
    const user_cache = await UserCache.findOne({ user_id: user.user_id });
    const { projects } = user_cache;
    const project_id = project._id;
    projects.push(project_id);
    await user_cache.save();

    return res.json(project);
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { project_id, user_id } = req.body;
  try {
    // Delete from Project model
    const project = await Project.findOne({ _id: project_id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project ${title} does not exist`,
      });
    }
    Project.findOneAndDelete({ _id: project_id }, async function (err, result) {
      if (err) {
        return res.status(500).json({
          error: "Something went wrong",
        });
      } else {
        // Update UserCache Model
        const user_cache = await UserCache.findOne({ user_id });
        const { projects } = user_cache;
        const filtered_projects = projects.filter(
          (project) => project.project_id !== project_id
        );
        user_cache.projects = filtered_projects;
        await user_cache.save();

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

// Update body, techStack

const updateProjectBody = async (req, res) => {
  const { project_id, body } = req.body;
  try {
    const project = await Project.findOne({ _id: project_id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project ${title} does not exist`,
      });
    }
    project.body = body;
    await project.save();
    return res.json({
      body: project.body
    });
  } catch (err) {

  }
}

const updateProjectTechStack = async (req, res) => {
  const { project_id, name, type, techStack_id } = req.body;
  try {
    const project = await Project.findOne({ _id: project_id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project ${title} does not exist`,
      });
    }
    
    switch(type) {
      case "ADD": {
        if(name !== "") {
          project.techStack.push({
            _id: mongoose.Types.ObjectId(),
            name
          })
        }
        await project.save();
        return res.json({
          techStack: project.techStack
        });
        break;
      }
      case "REMOVE": {
        const { techStack } = project;
        const updatedTechStack = techStack.filter(stack => stack.id !== techStack_id);
        project.techStack = updatedTechStack;
        await project.save();
        return res.json({
          techStack: project.techStack
        });
      }
    }    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Add members into project

const addMembers = async (req, res) => {
  const { username, project_id } =
    req.body;
  try {
    // Add into Project model
    const project = await Project.findOne({ _id: project_id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project does not exist`,
      });
    }

    const user = await User.findOne({ username });
    if(isObjectEmpty(user)) {
      return res.json({
        message: `User does not exist`,
      });
    }


    const { name } = user;
    const { members } = project;
    
    const filtered_members = members.filter(
      (member) => member.user_id.toString() === user.id
    );
    if (filtered_members.length !== 0) {
      return res.json({
        message: `${username} is already present in the project`,
      });
    }
    
    const user_detail = await new UserDetail({
      name,
      username,
      user_id: user.id
    });
    
    
    
    project.members.push(user_detail);
    await project.save();
    
    // Update UserCache model
    {
      const user_cache = await UserCache.findOne({ user_id: user._id });
      const { projects } = user_cache;
      const filtered_cache = projects.filter(
        (project) => project.toString() === project_id
      );
      if (filtered_cache.length !== 0) {
        return res.json({
          message: `${username} is already present in the project`,
        });
      }
      {
        const project_id = project._id;
        projects.push(project_id);
        await user_cache.save();
      }
    }

    return res.json(user_detail);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Remove member from project

const removeMember = async (req, res) => {
  const { user_id, project_id } = req.body;
  try {
    // Remove from Project model
    const project = await Project.findOne({ _id: project_id });
    if (isObjectEmpty(project)) {
      return res.json({
        message: `Project does not exist`,
      });
    }
    const { members } = project;
    const filtered_members = members.filter(
      (member) => member.user_id.toString() !== user_id
    );
    project.members = filtered_members;
    const updatedProject = await project.save();

    // Update UserCache model
    const user_cache = await UserCache.findOne({ user_id });
    const { projects } = user_cache;
    const filtered_cache = projects.filter(
      (project) => project.toString() !== project_id
    );
    user_cache.projects = filtered_cache;
    await user_cache.save();

    return res.json({
      user_id
    });
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
    const project = await Project.findOne({ _id: project_id }).populate('bugs');
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
    const user_cache = await UserCache.findOne({ user_id }).populate('projects');
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
  updateProjectBody,
  updateProjectTechStack,
  addMembers,
  removeMember,
  getProject,
  getProjectsOfUser,
};
