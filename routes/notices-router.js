const express = require("express");

const NoticesCtrl = require("../controllers/notices-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.post(
  "/notices/add",
  authCtrl.authenticateTokenAdmin,
  NoticesCtrl.createNotice
);
router.get("/notices/all", NoticesCtrl.getNotices);

module.exports = router;
