const express = require("express");
const applicantCtrl = require("../controllers/applicants-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.get("/applicants/all", applicantCtrl.getApplicants);
router.get("/applicants/awaiting", applicantCtrl.getAwaitingApplicants);
router.get("/applicants/accepted", applicantCtrl.getAcceptedApplicants);
router.get("/applicants/rejected", applicantCtrl.getRejectedApplicants);
router.post("/applicants", applicantCtrl.createApplicant);
router.put(
  "/applicants/:id",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.updateApplicant
);
router.delete(
  "/applicants/:id",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.removeApplicant
);

module.exports = router;
