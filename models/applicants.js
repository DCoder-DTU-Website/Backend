const mongoose = require("mongoose");

const UserApplied = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
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
    type: Number, // -1 => Rejected / 0 => Not Evaluated by Admin / 1 => Accepted
    default: 0,
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
  taskCompletionScore: {
    type: Number,
  },
  codingSkillsScore: {
    type: Number,
  },
  enthusiasmScore: {
    type: Number,
  },
  totalScore: {
    type: Number,
  },
  idRecruiter: { type: mongoose.Types.ObjectId, ref: "user" },
  remarksByRecruiter: {
    type: String,
  },
});

module.exports = mongoose.model("UserApplied", UserApplied);
