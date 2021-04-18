const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Lecture = new Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    topic: { type: String, required: true },
    subtopic: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("lectures", Lecture);
