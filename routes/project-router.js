const express = require("express");

const ProjectCtrl = require("../controllers/project-ctrl");

const router = express.Router();

router.post("/project/add", ProjectCtrl.createProject);
router.post("/project/:id/confirm", ProjectCtrl.confirmProject);
router.get("/project/all", ProjectCtrl.getProjects);
router.get("/project/unconfirmed", ProjectCtrl.getUnconfirmedProjects);
router.get("/project/:id", ProjectCtrl.getProjectById);
router.get("/project/:id/delete",ProjectCtrl.deleteProject);

module.exports = router;
