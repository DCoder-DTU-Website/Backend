const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Forms = new Schema(
  {
    title: { type: String, required: true },
    form_url: { type: String, required: true },
    response_url: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("forms", Forms);
