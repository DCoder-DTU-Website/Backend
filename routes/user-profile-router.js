const express = require("express");

const userProfileCtrl = require("../controllers/user-profile-ctrl");

const router = express.Router();

router.put("/userprofile", userProfileCtrl.updateProfile);
router.post("/userprofile", userProfileCtrl.getProfile);
router.get("/userprofile/all", userProfileCtrl.getAllProfiles);
router.delete("/userprofile/:id/remove",userProfileCtrl.deleteProfile);
module.exports = router;
