const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, required: true },
  resetToken:String,
  expireToken:Date
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
