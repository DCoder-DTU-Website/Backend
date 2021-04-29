const express = require("express");

const LectureCtrl = require("../controllers/lecture-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.post(
  "/lecture/add",
  authCtrl.authenticateTokenAdmin,
  LectureCtrl.createLecture
);
router.get("/lecture/all", LectureCtrl.getLectures);
router.get("/lecture/:topic/all", LectureCtrl.getLecturesByTopic);
router.get("/lecture/:topic/:subtopic", LectureCtrl.getLecturesBySubtopic);
router.get("/lecture/:id", LectureCtrl.getLectureById);

module.exports = router;
