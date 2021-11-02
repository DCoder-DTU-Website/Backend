const Placement = require("../models/placement");
const mongoose = require("mongoose");

createPlacement = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "No details found..",
    });
  }

  const placement = new Placement(body);

  if (!placement) {
    return res.status(400).json({ success: false, error: err });
  }

  placement
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: placement._id,
        message: "Placement created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
        body: body,
        message: "Placement not created!",
      });
    });
};

createPlacementBulk = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "No details found..",
    });
  }

  const {entries} = req.body;
  entries.forEach(item => {
    const placement = new Placement(item);
    placement.save();
  }) 
};


deletePlacement = (req, res) => {
  Placement.findOneAndDelete({ _id: req.params.id }, (err, placement) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!placement) {
      return res
        .status(404)
        .json({ success: false, error: `Placement not found` });
    }

    return res.status(200).json({ success: true, data: placement });
  }).catch((err) => console.log(err));
};

getPlacements = async (req, res) => {
  let placements = await Placement.find({isInternship: false});
  return res.status(200).json({success: true, data: placements})
}

getInternships = async (req, res) => {
  let placements = await Placement.find({isInternship: true});
  return res.status(200).json({success: true, data: placements})
}



module.exports = {
  createPlacement,
  createPlacementBulk,
  deletePlacement,
  getPlacements,
  getInternships
};
