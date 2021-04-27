const UserProfile = require("../models/userProfile");
const mongoose = require("mongoose");

module.exports.updateProfile = async (req, res) => {
  try {
    const { user, data } = req.body;
    await UserProfile.findOneAndUpdate({ email: user.email }, { ...data });
    res.send("Successfully updated profile!");
  } catch (err) {
    res.send("Error updating profile!", err);
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const { user } = req.body;
    const userProfile = await UserProfile.findOne({ email: user.email });
    res.send(userProfile);
  } catch (err) {
    console.log("Error retrieving profile", err);
  }
};

module.exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.find({});
    res.status(200).send(profiles);
  } catch (err) {
    res.send("Error retrieving all profiles", err);
  }
};
