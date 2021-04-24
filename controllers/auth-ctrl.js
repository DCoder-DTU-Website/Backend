const User = require("../models/user");
const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(user, "Thisissecret", { expiresIn: "60000s" });
}

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "Thisissecret", (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

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
  console.log(req.user);
  res.send("Logged out Successfully");
};

module.exports.user = (req, res) => {
  res.send(req.user);
};
