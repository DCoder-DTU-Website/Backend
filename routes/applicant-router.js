const express = require("express");
const applicantCtrl = require("../controllers/applicants-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

// For User on website
router.post("/applicants", applicantCtrl.createApplicant);

// For Admin
router.post(
  "/applicants/assignToRecruiters",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.assignApplicantsToRecruiters
);
router.post(
  "/applicants/assignToRecruitersBulk",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.assignApplicantsToRecruitersBulk
);
router.get(
  "/applicants/all",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.getApplicants
);
router.get(
  "/applicants/awaiting",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.getAwaitingApplicants
); // interview not completed
router.get(
  "/applicants/accepted",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.getAcceptedApplicants
);
router.get(
  "/applicants/rejected",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.getRejectedApplicants
);
router.post(
  "/applicants/accept/:id",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.acceptApplicant
);
router.post(
  "/applicants/reject/:id",
  authCtrl.authenticateTokenAdmin,
  applicantCtrl.rejectApplicant
);

// For Recruiter
router.get(
  "/applicants/all-recruiter",
  authCtrl.authenticateTokenRecruiter,
  applicantCtrl.getApplicants
);
router.get(
  "/applicants/awaiting-recruiter",
  authCtrl.authenticateTokenRecruiter,
  applicantCtrl.getAwaitingApplicants
);
router.post(
  "/applicants/setInterview",
  authCtrl.authenticateTokenRecruiter,
  applicantCtrl.setInterview
);
router.post(
  "/applicants/setMarks",
  authCtrl.authenticateTokenRecruiter,
  applicantCtrl.setMarks
); // implies interview is complete, admin can accept or reject applicants whose interview is completed

module.exports = router;
