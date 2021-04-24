const User = require("../models/user");

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, isAdmin: false });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.send(registeredUser);
    });
  } catch (e) {
    res.send(e);
  }
};

module.exports.login = async (req, res) => {
  console.log(req.user);
  res.send("Succesfully logged in");
};

module.exports.logout = (req, res) => {
  req.logout();
  console.log(req.user);
  res.send("Logged out Successfully");
};
