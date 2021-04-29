const express = require("express");

const userCtrl = require("../controllers/user-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.delete(
  "/user/:email/remove",
  authCtrl.authenticateTokenAdmin,
  userCtrl.deleteProfile
);
module.exports = router;
