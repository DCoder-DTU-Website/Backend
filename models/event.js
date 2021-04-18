const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Event = new Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: false },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("events", Event);
