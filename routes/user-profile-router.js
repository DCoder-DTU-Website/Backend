const express = require("express");

const userProfileCtrl = require("../controllers/user-profile-ctrl");

const router = express.Router();

router.patch("/userprofile", userProfileCtrl.updateProfile);
router.post("/userprofile", userProfileCtrl.getProfile);

module.exports = router;
