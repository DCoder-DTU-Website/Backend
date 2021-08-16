const UserApplied = require("../models/applicants");

module.exports.getApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find();
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports.createApplicant = async (req, res) => {
  const new_applicant = new UserApplied(req.body);
  try {
    await new_applicant.save().then(() => {
      res.status(201).json(new_applicant);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.removeApplicant = async (req, res) => {
  const id = req.params.id;
  try {
    await UserApplied.findOneAndRemove({ _id: id });
    res.status(203).json({ _id: id });
  } catch (error) {
    res.status(402).json({ message: error.message });
  }
};
