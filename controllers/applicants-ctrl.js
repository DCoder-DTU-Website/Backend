const UserApplied = require("../models/applicants");
var nodemailer = require("nodemailer");

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
    new_applicant.save().then(() => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "temp24918@gmail.com",
          pass: "temp@999",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: "temp24918@gmail.com",
        to: new_applicant.email,
        subject: "Dcoder mein swagat hai aapka",
        text: "Aapki jaankari hamne prapt krli hai ab kriya krke pratiksha krein hum jldi hi aapse sampark karenge",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.send("Unable to send the mail to you");
        } else {
          res.send("Email sent: " + info.response);
        }
      });
      res.status(201).json(new_applicant);
    });
  } catch (error) {
    res.status(400).json("Unable to save the details of the user");
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
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "temp24918@gmail.com",
        pass: "temp@999",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: "temp24918@gmail.com",
      to: new_applicant.email,
      subject: "Interview has been set",
      text: "Details of interview!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send("Unable to send the mail to you");
      } else {
        res.send("Email sent: " + info.response);
      }
    });
    return res
      .status(200)
      .json({ message: "Successfully set interview", success: true });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.acceptApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        interviewCompleted: true,
        isAccepted: true,
      }
    );
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "temp24918@gmail.com",
        pass: "temp@999",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: "temp24918@gmail.com",
      to: new_applicant.email,
      subject: "Accepted to D_Coder",
      text: "Welcome to D_Coder",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send("Unable to send the mail to you");
      } else {
        res.send("Email sent: " + info.response);
      }
    });
    return res
      .status(200)
      .json({ message: "Successfully set interview", success: true });
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
        interviewCompleted: true,
        isAccepted: false,
      }
    );
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "temp24918@gmail.com",
        pass: "temp@999",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: "temp24918@gmail.com",
      to: new_applicant.email,
      subject: "Rejected Application",
      text: "Thanks for applying tho",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send("Unable to send the mail to you");
      } else {
        res.send("Email sent: " + info.response);
      }
    });
    return res
      .status(200)
      .json({ message: "Successfully set interview", success: true });
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
