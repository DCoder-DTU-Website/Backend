const express = require("express");

const PlacementCtrl = require("../controllers/placement-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.post(
  "/placements/add",
  PlacementCtrl.createPlacement
);
router.post(
  "/placements/add-bulk",
  PlacementCtrl.createPlacementBulk
);
router.delete(
  "/placements/:id/delete",
  PlacementCtrl.deletePlacement
);
router.get("/placements/interns", PlacementCtrl.getInternships);
router.get("/placements/fulltime", PlacementCtrl.getPlacements);

module.exports = router;
