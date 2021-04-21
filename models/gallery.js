const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Gallery = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("galleries", Gallery);
