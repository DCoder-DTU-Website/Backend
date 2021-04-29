const express = require("express");

const ProjectCtrl = require("../controllers/project-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.post(
  "/project/add",
  authCtrl.authenticateToken,
  ProjectCtrl.createProject
);
router.post(
  "/project/:id/confirm",
  authCtrl.authenticateTokenAdmin,
  ProjectCtrl.confirmProject
);
router.delete(
  "/project/:id/delete",
  authCtrl.authenticateTokenAdmin,
  ProjectCtrl.deleteProject
);
router.get("/project/all", ProjectCtrl.getProjects);
router.get("/project/unconfirmed", ProjectCtrl.getUnconfirmedProjects);
router.get("/project/:id", ProjectCtrl.getProjectById);

module.exports = router;
