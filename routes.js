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
  updateLabel,
} = require("./controllers/bugController");
const {
  postComment,
  updateComment,
  deleteComment,
  reactToComment,
} = require("./controllers/commentController");
const {
  getNotifications,
  markAsRead,
} = require("./controllers/notificationController");
const {
  addProject,
  deleteProject,
  updateProjectBody,
  updateProjectTechStack,
  addMembers,
  removeMember,
  getProject,
  getProjectsOfUser,
} = require("./controllers/projectController");
const {
  signup,
  login,
  logout,
  getUser,
  getUserCache,
} = require("./controllers/userController");

const router = express.Router();

// User Controller
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getUser/:username", getUser);
router.get("/getUserCache/:username", getUserCache);

// Project Controller
router.post("/addProject", addProject);
router.post("/deleteProject", deleteProject);
router.post("/updateProjectBody", updateProjectBody);
router.post("/updateProjectTechStack", updateProjectTechStack);
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
router.post("/updateLabel", updateLabel);

// Comment controller
router.post("/postComment", postComment);
router.post("/updateComment", updateComment);
router.post("/deleteComment", deleteComment);
router.post("/reactToComment", reactToComment);

// Notification controller
router.get("/getNotification/:user_id", getNotifications);
router.post("/markAsRead", markAsRead);

module.exports = router;
