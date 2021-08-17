const express = require("express");
const applicantCtrl = require("../controllers/applicants-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.get("/applicants/all", applicantCtrl.getApplicants);
router.post("/applicants/accept/:id", applicantCtrl.acceptApplicant);
router.post("/applicants/reject/:id", applicantCtrl.rejectApplicant);
router.post("/applicants/setInterview", applicantCtrl.setInterview);
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
