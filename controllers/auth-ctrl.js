const User = require("../models/user");
const UserProfile = require("../models/userProfile");
const jwt = require("jsonwebtoken");

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
