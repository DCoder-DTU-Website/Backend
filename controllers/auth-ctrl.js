const User = require("../models/user");
const UserProfile = require("../models/userProfile");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const passportLocalMongoose = require("passport-local-mongoose");
const { resolveSoa } = require("dns");

function generateAccessToken(user) {
  return jwt.sign(user, "Thisissecret", { expiresIn: "60000s" });
}

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "Thisissecret", async (err, user) => {
    if (err) return res.sendStatus(403);

    const userDb = await User.findOne({
      email: user.email,
      username: user.username,
    }).exec();
    req.user = userDb;

    next();
  });
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, isAdmin: false });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      const token = generateAccessToken({ email, username });
      res.json(token);
    });
    const userProfile = new UserProfile({ email });
    await userProfile.save();
  } catch (e) {
    res.send(e);
  }
};

module.exports.login = async (req, res) => {
  const token = generateAccessToken({
    email: req.body.email,
    username: req.body.username,
  });
  res.json(token);
  res.send("Succesfully logged in");
};

module.exports.logout = (req, res) => {
  req.logout();
  res.send("Logged out Successfully");
};

module.exports.user = (req, res) => {
  res.send(req.user);
};

module.exports.resetPass = (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "temp24918@gmail.com", // generated ethereal user
      pass: "temp@999", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.send({ message: "No such user exist !" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "temp24918@gmail.com",
          subject: "Password reset",
          html: `
          <p>You requested for password reset</p>
          <h2> Valid for 1hr only </h2>
          <h5>Click in this <a href = "http://localhost:3000/reset/${token}">link </a> to reset password</h5>
          `,
        });
        res.send({ message: "Check your email" });
      });
    });
  });
};

module.exports.passwordReset = (req, res) => {
  console.log(req.body);
  User.findOne({
    resetToken: req.body.token,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.status(422).json({ error: "Token is expired" });
    }
    user.changePassword(req.body.oldPassword, req.body.newPassword, (err) => {
      if (err) return res.send({ message: "Invalid Password" });
      else {
        return res.send({ message: "Password Changed Successfully" });
      }
    });
  });
};
