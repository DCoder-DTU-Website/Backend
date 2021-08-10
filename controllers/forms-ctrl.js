const Form = require("../models/forms");
const mongoose = require("mongoose");

module.exports.createForm = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "No details found..",
    });
  }

  const form = new Form(body);

  if (!form) {
    return res.status(400).json({ success: false, error: err });
  }

  form
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: form._id,
        message: "Form created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
        body: body,
        message: "Form not created!",
      });
    });
};

module.exports.getForms = async (req, res) => {
  await Form.find({}, (err, form) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!form.length) {
      return res.status(404).json({ success: false, error: `Form not found` });
    }
    return res.status(200).json({ success: true, data: form });
  }).catch((err) => console.log(err));
};
