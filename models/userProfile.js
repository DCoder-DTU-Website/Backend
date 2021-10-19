const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Profile = new Schema({
  firstName: String,
  lastName: String,
  image: String,
  desc: String,
  email: String,
  contact: Number,
  linkedin: String,
  github: String,
  codeforces: String,
  codechef: String,
  leetcode: String,
  branch: String,
  year: String,
  techStack: [String],
  workingWith: [String],
  resume: String,
  isRecruiter: Boolean,
});

module.exports = mongoose.model("profile", Profile);
