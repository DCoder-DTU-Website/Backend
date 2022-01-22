const express = require("express");

const userCtrl = require("../controllers/user-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.delete(
  "/user/:email/remove",
  authCtrl.authenticateTokenAdmin,
  userCtrl.deleteProfile
);
router.patch(
  "/user/:email/recruiter",
  authCtrl.authenticateTokenAdmin,
  userCtrl.setRecruiter
);
router.patch(
  "/user/:email/remove-recruiter",
  // authCtrl.authenticateTokenAdmin,
  userCtrl.removeRecruiter
);

module.exports = router;
