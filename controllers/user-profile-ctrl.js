const UserProfile = require("../models/userProfile");
const mongoose = require("mongoose");

module.exports.updateProfile = async (req, res) => {
  const { user, userProfile } = req.body;
  await UserProfile.findOneAndUpdate({ email: user.email }, { ...userProfile });
  res.send("Successfully updated profile!");
};

module.exports.getProfile = async (req, res) => {
  const { user } = req.body;
  const userProfile = await UserProfile.findOne({ email: user.email });
  res.send(userProfile);
};
