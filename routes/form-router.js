const express = require("express");

const FormsCtrl = require("../controllers/forms-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.post(
  "/forms/add",
  // authCtrl.authenticateTokenAdmin,
  FormsCtrl.createForm
);
router.get("/forms/all", FormsCtrl.getForms);

module.exports = router;
