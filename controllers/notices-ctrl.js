const Notice = require("../models/notices");
const UserProfile = require("../models/userProfile");
const mongoose = require("mongoose");
const { sendMail } = require("../utils/node-mailer");

module.exports.createNotice = async (req, res) => {
  try {
    const body = req.body;
    const profiles = await UserProfile.find({});
    const emails = profiles.map((profile, index) => {
      return profile.email;
    });
    if (!body) {
      return res.status(400).json({
        success: false,
        error: "No details found..",
      });
    }

    const notice = new Notice(body);

    if (!notice) {
      return res.status(400).json({ success: false, error: err });
    }

    await notice.save();
    const mailRes = sendMail(
      {
        service: "gmail",
        user: "temp24918@gmail.com",
        pass: "temp@999",
      },
      {
        from: "temp24918@gmail.com",
        to: "temp24918@gmail.com",
        bcc: emails,
        subject: "D_CODER: New Notice Uploaded",
        text: "A new notice has been uploaded! Check www.teamdcoder.com",
      }
    );
    return res.status(201).json({
      success: true,
      id: notice._id,
      message: "Notice created!",
      mailRes: mailRes,
    });
  } catch (err) {
    res.status(400).json({
      error: error,
      body: body,
      message: "Notice not created!",
      mailRes: mailRes,
    });
  }
};

module.exports.getNotices = async (req, res) => {
  await Notice.find({}, (err, notice) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!notice.length) {
      return res
        .status(404)
        .json({ success: false, error: `Notice not found` });
    }
    return res.status(200).json({ success: true, data: notice });
  }).catch((err) => console.log(err));
};
