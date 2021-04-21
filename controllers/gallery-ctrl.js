const Gallery = require("../models/gallery");
const mongoose = require("mongoose");

createImage = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "No details found..",
    });
  }

  const galleryImage = new Gallery(body);

  if (!galleryImage) {
    return res.status(400).json({ success: false, error: err });
  }

  galleryImage
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: galleryImage._id,
        message: "Gallery Image created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
        body: body,
        message: "Event not created!",
      });
    });
};

getImages = async (req, res) => {
  await Gallery.find({}, (err, images) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!images.length) {
      return res
        .status(404)
        .json({ success: false, error: `Images not found` });
    }
    return res.status(200).json({ success: true, data: images });
  }).catch((err) => console.log(err));
};

module.exports = {
  createImage,
  getImages,
};
