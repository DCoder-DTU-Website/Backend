const express = require("express");

const EventCtrl = require("../controllers/event-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.post(
  "/event/add",
  authCtrl.authenticateTokenAdmin,
  EventCtrl.createEvent
);
router.get("/event/all", EventCtrl.getEvents);
router.get("/event/:id", EventCtrl.getEventById);

module.exports = router;
