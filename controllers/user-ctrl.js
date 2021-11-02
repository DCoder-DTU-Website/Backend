const User = require("../models/user");
const mongoose = require("mongoose");
const userProfile = require("../models/userProfile");

module.exports.deleteProfile = (req, res) => {
  User.findOneAndDelete({ username: req.params.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `user not found` });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};

module.exports.setRecruiter = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        username: req.params.email,
      },
      { isRecruiter: true },
      { new: true }
    );
    await userProfile.findOneAndUpdate(
      {
        email: req.params.email,
      },
      { isRecruiter: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: `user not found` });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(400).json({ success: false, error: err });
  }
};

module.exports.removeRecruiter = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        username: req.params.email,
      },
      { isRecruiter: false },
      { new: true }
    );
    await userProfile.findOneAndUpdate(
      {
        email: req.params.email,
      },
      { isRecruiter: false }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: `user not found` });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(400).json({ success: false, error: err });
  }
};
