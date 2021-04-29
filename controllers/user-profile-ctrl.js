const UserProfile = require("../models/userProfile");
const mongoose = require("mongoose");

module.exports.updateProfile = async (req, res) => {
  try {
    const { data } = req.body;
    const user = req.body.user || req.body.userFromAdmin;
    await UserProfile.findOneAndUpdate({ email: user.email }, { ...data });
    res.send("Successfully updated profile!");
  } catch (err) {
    res.send("Error updating profile!", err);
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const user = req.body.user || req.body.userFromAdmin;
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

module.exports.deleteProfile = (req, res) => {
  UserProfile.findOneAndDelete({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `user not found` });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};
