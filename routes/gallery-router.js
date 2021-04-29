const express = require("express");

const GalleryCtrl = require("../controllers/gallery-ctrl");
const authCtrl = require("../controllers/auth-ctrl");

const router = express.Router();

router.post(
  "/gallery/add",
  authCtrl.authenticateTokenAdmin,
  GalleryCtrl.createImage
);
router.get("/gallery/all", GalleryCtrl.getImages);

module.exports = router;
