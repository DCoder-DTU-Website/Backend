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

module.exports.authenticateTokenRecruiter = (req, res, next) => {
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
      if (userDb.isRecruiter) {
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
      user: "dcoderquery@gmail.com", // generated ethereal user
      pass: "teamdcoder2022", // generated ethereal password
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
          from: "dcoderquery@gmail.com",
          subject: "Password reset",
          html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
              <style>
                @import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,200&display=swap");
          
                * {
                  margin: 0;
                  padding: 0;
                  border: 0;
                }
          
                body {
                  font-family: "Raleway", sans-serif;
                  background-color: #d8dada;
                  font-size: 19px;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 3%;
                }
          
                img {
                  max-width: 100%;
                }
          
                header {
                  width: 98%;
                }
          
                #logo {
                  max-width: 120px;
                  margin: 3% 0 3% 3%;
                  float: left;
                }
          
                #wrapper {
                  background-color: #f0f6fb;
                }
          
                #social {
                  float: right;
                  margin: 3% 2% 4% 3%;
                  list-style-type: none;
                }
          
                #social > li {
                  display: inline;
                }
          
                #social > li > a > img {
                  max-width: 35px;
                }
          
                h1,
                p,
                a {
                  margin: 3%;
                }
                .btn {
                  float: right;
                  margin: 0 2% 4% 0;
                  background-color: #303840;
                  color: #f6faff;
                  text-decoration: none;
                  font-weight: 800;
                  padding: 8px 12px;
                  border-radius: 8px;
                  letter-spacing: 2px;
                }
          
                hr {
                  height: 1px;
                  background-color: #303840;
                  clear: both;
                  width: 96%;
                  margin: auto;
                }
          
                #contact {
                  text-align: left;
                  padding-bottom: 3%;
                  line-height: 16px;
                  font-size: 12px;
                  color: #303840;
                }
          
                .reset-btn {
                  padding: 12px 30px;
                  background-color: #2179a7;
                  border-radius: 5px;
                  cursor: pointer;
                }
              </style>
            </head>
            <body>
              <div id="wrapper">
                <header>
                  <div id="logo">
                    <img
                      src="https://res.cloudinary.com/dcoderdtu/image/upload/v1642826937/D_CODER_LOGO_color_1_lzxspa.png"
                      alt=""
                    />
                  </div>
                  <div>
                    <ul id="social">
                      <li>
                        <a
                          href="https://www.linkedin.com/company/dcoder/mycompany/"
                          target="_blank"
                          ><img
                            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                            alt=""
                        /></a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/d_coder_dtu/" target="_blank"
                          ><img
                            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
                            alt=""
                        /></a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/channel/UCz0Bs3AXaa5ccEJBsLxyXzg"
                          target="_blank"
                          ><img
                            src="https://cdn-icons-png.flaticon.com/512/174/174883.png"
                            alt=""
                        /></a>
                      </li>
                    </ul>
                  </div>
                </header>
                <div id="banner">
                  <img src="./eafd64f6-6f8f-46a9-9aae-295b64155e7a.jpg" alt="" />
                </div>
                <div class="one-col">
                  <h1>Hi ${user.email},<br /></h1>
          
                  <p><strong> Want to Reset your Password? No worries!</strong></p>
          
                  <p>
                    We have received a request to reset the password for your account.
                  </p>
                  <p>To reset your password, click on the button below.</p>
                  <a href="https://teamdcoder.com/forgot/${token}"
                    ><button class="reset-btn">Reset Password</button>
                  </a>
                  <p>
                    We recommend you to not share your password with anyone else. If you
                    need help regarding anything, or you have any other questions, please
                    feel free to drop us an email at contact@teamdcoder.com.
                  </p>
                  <p>
                    If you didn’t initiate this request, please contact us immediately.
                  </p>
          
                  <hr />
          
                  <footer>
                    <p id="contact">
                      Thanks,
                      <br />
                      Team D_CODER <br />
                    </p>
                  </footer>
                </div>
              </div>
            </body>
          </html>
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
      user: "dcoderquery@gmail.com", // generated ethereal user
      pass: "teamdcoder2022", // generated ethereal password
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
          from: "dcoderquery@gmail.com",
          subject: "Password Forgot",
          html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
              <style>
                @import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,200&display=swap");
          
                * {
                  margin: 0;
                  padding: 0;
                  border: 0;
                }
          
                body {
                  font-family: "Raleway", sans-serif;
                  background-color: #d8dada;
                  font-size: 19px;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 3%;
                }
          
                img {
                  max-width: 100%;
                }
          
                header {
                  width: 98%;
                }
          
                #logo {
                  max-width: 120px;
                  margin: 3% 0 3% 3%;
                  float: left;
                }
          
                #wrapper {
                  background-color: #f0f6fb;
                }
          
                #social {
                  float: right;
                  margin: 3% 2% 4% 3%;
                  list-style-type: none;
                }
          
                #social > li {
                  display: inline;
                }
          
                #social > li > a > img {
                  max-width: 35px;
                }
          
                h1,
                p,
                a {
                  margin: 3%;
                }
                .btn {
                  float: right;
                  margin: 0 2% 4% 0;
                  background-color: #303840;
                  color: #f6faff;
                  text-decoration: none;
                  font-weight: 800;
                  padding: 8px 12px;
                  border-radius: 8px;
                  letter-spacing: 2px;
                }
          
                hr {
                  height: 1px;
                  background-color: #303840;
                  clear: both;
                  width: 96%;
                  margin: auto;
                }
          
                #contact {
                  text-align: left;
                  padding-bottom: 3%;
                  line-height: 16px;
                  font-size: 12px;
                  color: #303840;
                }
          
                .reset-btn {
                  padding: 12px 30px;
                  background-color: #2179a7;
                  border-radius: 5px;
                  cursor:pointer;
                }
              </style>
            </head>
            <body>
              <div id="wrapper">
                <header>
                  <div id="logo">
                    <img
                      src="https://res.cloudinary.com/dcoderdtu/image/upload/v1642826937/D_CODER_LOGO_color_1_lzxspa.png"
                      alt=""
                    />
                  </div>
                  <div>
                    <ul id="social">
                      <li>
                        <a
                          href="https://www.linkedin.com/company/dcoder/mycompany/"
                          target="_blank"
                          ><img
                            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                            alt=""
                        /></a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/d_coder_dtu/" target="_blank"
                          ><img
                            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
                            alt=""
                        /></a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/channel/UCz0Bs3AXaa5ccEJBsLxyXzg"
                          target="_blank"
                          ><img
                            src="https://cdn-icons-png.flaticon.com/512/174/174883.png"
                            alt=""
                        /></a>
                      </li>
                    </ul>
                  </div>
                </header>
                <div id="banner">
                  <img src="./eafd64f6-6f8f-46a9-9aae-295b64155e7a.jpg" alt="" />
                </div>
                <div class="one-col">
                  <h1>Hi ${user.email},<br /></h1>
          
                  <p><strong> Forgot your password? No worries!</strong></p>
          
                  <p>
                    We have received a request to reset the password for your account.
                  </p>
                  <p>To reset your password, click on the button below.</p>
                  <a href="https://teamdcoder.com/forgot/${token}"
                    ><button class="reset-btn">Reset Password</button>
                  </a>
                  <p>
                    We recommend you to not share your password with anyone else. If you
                    need help regarding anything, or you have any other questions, please
                    feel free to drop us an email at contact@teamdcoder.com.
                  </p>
                  <p>
                    If you didn’t initiate this request, please contact us immediately.
                  </p>
          
                  <hr />
          
                  <footer>
                    <p id="contact">
                      Thanks,
                      <br />
                      Team D_CODER <br />
                    </p>
                  </footer>
                </div>
              </div>
            </body>
          </html>
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
