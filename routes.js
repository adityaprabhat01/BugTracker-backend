const express = require("express");
const {
  addBug,
  updateBug,
  addMemberBug,
  removeMemberBug,
  getBug,
  getBugsOfUser,
  closeBug,
  reopenBug,
} = require("./controllers/bugController");
const {
  postComment,
  updateComment,
  deleteComment,
} = require("./controllers/commentController");
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

// Bug controller
router.post("/addBug", addBug);
router.post("/updateBug", updateBug);
router.post("/addMemberBug", addMemberBug);
router.post("/removeMemberBug", removeMemberBug);
router.get("/getBug/:bug_id", getBug);
router.get("/getBugsOfUser/:user_id", getBugsOfUser);
router.post("/closeBug", closeBug);
router.post("/reopenBug", reopenBug);

// Comment controller
router.post("/postComment", postComment);
router.post("/updateComment", updateComment);
router.post("/deleteComment", deleteComment);

module.exports = router;
