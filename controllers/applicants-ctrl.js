const mongoose = require("mongoose");
const UserApplied = require("../models/applicants");
const { sendMail } = require("../utils/node-mailer");


function splitToChunks(array, parts) {
  let result = [];
  for (let i = parts; i > 0; i--) {
      result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}

// For User
module.exports.createApplicant = async (req, res) => {
  const new_applicant = new UserApplied(req.body);
  try {
    new_applicant.save().then(() => {
      const mailRes = sendMail({
        from: "temp24918@gmail.com",
        to: new_applicant.email,
        subject: "Dcoder mein swagat hai aapka",
        text: "Aapki jaankari hamne prapt krli hai ab kriya krke pratiksha krein hum jldi hi aapse sampark karenge",
      });
      res.status(201).json(new_applicant);
    });
  } catch (error) {
    res.status(400).json("Unable to save the details of the user");
  }
};

// For Admin

module.exports.assignApplicantsToRecruiters = async (req, res) => {
  try {
    //payload: [{idRecruiter: id, idApplicants:[idApplied1, idApplied2, idApplied3...]}, {...},...]
    let reqs = req.body.payload;
    console.log("REQS!", reqs);
    reqs.forEach(async entry=>{
      await UserApplied.updateMany(
        {
             _id: { "$in": entry.idApplicants }
        }, 
        {
          idRecruiter: mongoose.Types.ObjectId(entry.idRecruiter)
        })
    });
    res.status(200).json({ message: "Done"});
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports.assignApplicantsToRecruitersBulk = async (req, res) => {
  try {
    //idRecruiters: ['...','...',...], idApplicants: ['...','...',...]
    let {idRecruiters, idApplicants} = req.body;
    idApplicants = splitToChunks(idApplicants, idRecruiters.length);
    let reqs = idRecruiters.map((id,index)=>{
      return {
        idRecruiter: id,
        idApplicants: idApplicants[index]
      }
    });
    reqs.forEach(async entry=>{
      await UserApplied.updateMany(
        {
             _id: { "$in": entry.idApplicants }
        }, 
        {
          idRecruiter: mongoose.Types.ObjectId(entry.idRecruiter)
        })
    });
    res.status(200).json({ message: "Done"});
  } catch (error) {
    console.log("ERROR!:",error);
    res.status(400).json({ error: error });
  }
};

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

module.exports.acceptApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        isAccepted: true,
      }
    );

    const mailRes = sendMail({
      from: "temp24918@gmail.com",
      to: update_applicant.email,
      subject: "Accepted to D_Coder",
      text: "Welcome to D_Coder",
    });

    return res.status(200).json({
      message: "Successfully set interview",
      success: true,
      mailRes: mailRes,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.rejectApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        isAccepted: false,
      }
    );

    const mailRes = sendMail({
      from: "temp24918@gmail.com",
      to: update_applicant.email,
      subject: "Rejected Application",
      text: "Thanks for applying tho",
    });

    return res.status(200).json({
      message: "Successfully set interview",
      success: true,
      mailRes: mailRes,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// For Recruiter

module.exports.setInterview = async (req, res) => {
  const { id, interviewerName, interviewTime, interviewLink } = req.body;
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        interviewTime: interviewTime,
        interviewLink: interviewLink,
        interviewerName: interviewerName,
      }
    );

    const mailRes = sendMail({
      from: "temp24918@gmail.com",
      to: update_applicant.email,
      subject: "Interview has been set",
      text: "Details of interview!",
    });

    return res.status(200).json({
      message: "Successfully set interview",
      success: true,
      mailRes: mailRes,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.setMarks = async (req, res) => {
  const {
    id,
    taskCompletionScore,
    codingSkillsScore,
    enthusiasmScore,
    remarksByRecruiter,
  } = req.body;
  const totalScore = taskCompletionScore + codingSkillsScore + enthusiasmScore;
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        taskCompletionScore,
        codingSkillsScore,
        enthusiasmScore,
        totalScore,
        remarksByRecruiter,
        interviewCompleted: true,
      }
    );

    return res.status(200).json({
      message: "Successfully marked!",
      success: true,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
