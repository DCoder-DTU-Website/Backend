const express = require("express");
const applicantCtrl = require("../controllers/applicants-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.get("/applicants/all", applicantCtrl.getApplicants);
router.post("/applicants", applicantCtrl.createApplicant);
router.delete("/applicants/:id", applicantCtrl.removeApplicant);

module.exports = router;
