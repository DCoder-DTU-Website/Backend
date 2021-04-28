const User = require("../models/user");
const mongoose = require("mongoose");

module.exports.deleteProfile = (req, res) => {
    User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
  
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: `user not found` });
      }
      console.log(user)
      return res.status(200).json({ success: true, data: user });
    }).catch((err) => console.log(err));
  };