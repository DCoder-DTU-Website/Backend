const UserApplied = require("../models/applicants");

module.exports.getApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find();
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports.getAwaitingApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find({ interviewCompleted: false });
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
module.exports.getAcceptedApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find({ isAccepted: true });
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports.getRejectedApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find({
      isAccepted: false,
      interviewCompleted: true,
    });
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

module.exports.updateApplicant = async (req, res) => {
  const id = req.params.id;
  const update_applicant = new UserApplied(req.body);
  try {
    await UserApplied.findOneAndUpdate({ _id: id }, update_applicant).then(
      () => {
        res.status(202).json({ _id: id });
      }
    );
  } catch (error) {
    res.status(401).json({ message: error.message });
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
