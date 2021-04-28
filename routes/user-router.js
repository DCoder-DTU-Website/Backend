const express = require("express");

const userCtrl = require("../controllers/user-ctrl");

const router = express.Router();

router.delete("/user/:email/remove",userCtrl.deleteProfile);
module.exports = router;
