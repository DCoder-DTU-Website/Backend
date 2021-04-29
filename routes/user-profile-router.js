const express = require("express");

const userProfileCtrl = require("../controllers/user-profile-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.put(
  "/userprofile",
  authCtrl.authenticateToken,
  userProfileCtrl.updateProfile
);
router.post(
  "/userprofile",
  authCtrl.authenticateToken,
  userProfileCtrl.getProfile
);
router.get(
  "/userprofile/all",
  authCtrl.authenticateTokenAdmin,
  userProfileCtrl.getAllProfiles
);
router.delete(
  "/userprofile/:id/remove",
  authCtrl.authenticateTokenAdmin,
  userProfileCtrl.deleteProfile
);
module.exports = router;
