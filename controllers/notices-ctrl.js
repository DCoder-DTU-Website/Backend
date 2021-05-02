const Notice = require("../models/notices");
const mongoose = require("mongoose");

module.exports.createNotice = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "No details found..",
    });
  }

  const notice = new Notice(body);

  if (!notice) {
    return res.status(400).json({ success: false, error: err });
  }

  notice
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: notice._id,
        message: "Notice created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
        body: body,
        message: "Notice not created!",
      });
    });
};

module.exports.getNotices = async (req, res) => {
  await Notice.find({}, (err, notice) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!notice.length) {
      return res
        .status(404)
        .json({ success: false, error: `Notice not found` });
    }
    return res.status(200).json({ success: true, data: notice });
  }).catch((err) => console.log(err));
};
