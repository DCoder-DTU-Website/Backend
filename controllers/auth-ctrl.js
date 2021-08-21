const User = require("../models/user");
const UserProfile = require("../models/userProfile");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../db/index");

const passportLocalMongoose = require("passport-local-mongoose");
const { resolveSoa } = require("dns");

function generateAccessToken(user) {
  return jwt.sign(user, "Thisissecret", { expiresIn: "60000s" });
}

module.exports.authenticateToken = (req, res, next) => {
  try {
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
  } catch (err) {
    res.send(err);
  }
};

module.exports.authenticateTokenAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, "Thisissecret", async (err, user) => {
      if (err) return res.sendStatus(403);

      const userDb = await User.findOne({
        email: user.email,
        username: user.username,
      }).exec();
      if (userDb.isAdmin) {
        req.user = userDb;
      } else {
        return res.sendStatus(401);
      }
      next();
    });
  } catch (err) {
    res.send(err);
  }
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
  } catch (err) {
    res.send(err);
  }
};

module.exports.login = async (req, res) => {
  try {
    const token = generateAccessToken({
      email: req.body.email,
      username: req.body.username,
    });
    res.json(token);
    res.send("Succesfully logged in");
  } catch (err) {
    res.send(err);
  }
};

module.exports.logout = (req, res) => {
  try {
    req.logout();
    res.send("Logged out Successfully");
  } catch (err) {
    res.send(err);
  }
};

module.exports.user = (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.send(err);
  }
};

module.exports.resetPass = (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ttemp5172@gmail.com", // generated ethereal user
      pass: "temp@123", // generated ethereal password
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
          from: "ttemp5172@gmail.com",
          subject: "Password reset",
          html: `
          <p>You requested for password reset.</p>
          <h2> Valid for 1hr only </h2>
          <h5>Click on this <a href = "http://localhost:3000/reset/${token}">link </a> to reset your password.</h5>
          `,
        });
        res.send({ message: "Check your email" });
      });
    });
  });
};


module.exports.forgotPass = (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ttemp5172@gmail.com", // generated ethereal user
      pass: "temp@123", // generated ethereal password
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
          from: "ttemp5172@gmail.com",
          subject: "Password Forgot",
          html: `
          <p>You requested for password forgot.</p>
          <h2> Valid for 1hr only </h2>
          <h5>Click on this <a href = "http://localhost:3000/forgot/${token}">link </a> to reset your password.</h5>
          `,
        });
        res.send({ message: "Check your email" });
      });
    });
  });
};

module.exports.passwordReset = (req, res) => {
  User.findOne({
    resetToken: req.body.token,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.send({ message: "Token is expired" });
    }
    user.changePassword(req.body.oldPassword, req.body.newPassword, (err) => {
      if (err) return res.send({ message: "Invalid Password" });
      else {
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save();
        return res.send({ message: "Password Changed Successfully" });
      }
    });
  });
};


module.exports.passwordForgot = (req, res) => {
  User.findOne({
    resetToken: req.body.token,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.send({ message: "Token is expired" });
    }
    user.setPassword(req.body.newPassword, (err) => {
      if (err) return res.send({ message: "Invalid Password" });
      else {
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save();
        return res.send({ message: "Password Changed Successfully" });
      }
    });
  });
};
