const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://root:12345@cluster0.rurv5.mongodb.net/d_coder?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .catch((e) => {
    console.error("Connection error", e.message);
  });

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

module.exports = db;
