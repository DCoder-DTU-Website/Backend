const express = require("express");

const GalleryCtrl = require("../controllers/gallery-ctrl");

const router = express.Router();

router.post("/gallery/add", GalleryCtrl.createImage);
router.get("/gallery/all", GalleryCtrl.getImages);

module.exports = router;
