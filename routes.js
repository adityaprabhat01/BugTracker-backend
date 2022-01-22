const express = require("express");
const {
  addProject,
  deleteProject,
  updateProject,
  addMembers,
  removeMember,
  getProject,
  getProjectsOfUser,
} = require("./controllers/projectController");
const { signup, login, logout } = require("./controllers/userController");

const router = express.Router();

// User Controller
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// Project Controller
router.post("/addProject", addProject);
router.post("/deleteProject", deleteProject);
router.post("/updateProject", updateProject);
router.post("/addMembers", addMembers);
router.post("/removeMember", removeMember);
router.get("/getProject/:project_id", getProject);
router.get("/getProjectsOfUser/:user_id", getProjectsOfUser);

module.exports = router;
