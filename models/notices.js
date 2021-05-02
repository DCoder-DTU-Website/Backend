const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notices = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link:{type:String,required:false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("notices", Notices);
