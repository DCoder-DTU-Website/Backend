const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send", (req, res) => {
  const output = `
          <p>You have a new contact request</p>
          <h3>Contact Details</h3>
          <ul>  
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
          </ul>
          <h3>Message</h3>
          <p>${req.body.message}</p>
        `;

  // create reusable transporter object using the default SMTP transport
  console.log(req.body);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dcoderquery@gmail.com", // generated ethereal user
      pass: "teamdcoder2022", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: "dcoderquery@gmail.com", // sender address
    to: "connectdcoder@gmail.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.send(info);
  });
});

module.exports = router;
