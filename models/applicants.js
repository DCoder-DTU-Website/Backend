const mongoose = require("mongoose");

const UserApplied = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
  },
  codingLanguage: {
    type: [String],
  },
  whyJoin: {
    type: String,
    required: true,
  },
  expect: {
    type: String,
    required: true,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  interviewCompleted: {
    type: Boolean,
    default: false,
  },
  interviewLink: {
    type: String,
  },
  interviewTime: {
    type: String,
  },
  interviewerName: {
    type: String,
  },
});

module.exports = mongoose.model("UserApplied", UserApplied);
