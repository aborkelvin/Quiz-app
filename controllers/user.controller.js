const bcrypt = require("bcryptjs");

const { createAuthenticationToken } = require("../auth/authFunctions");
const User = require("../models/user.model");
const { createOne, getAll } = require("./generic.controller");

const getAllUsers = getAll(User, "User");

//Sign in
const signIn = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid Username or Password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Username or Password" });
  }
  user.password = undefined;
  console.log(user);
  req.user = user;
  createAuthenticationToken(req.user, res, 200);
};

const signUp = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    createAuthenticationToken(user, res, 201);
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message ? err.message : "Internal Server error",
    });
  }
};

module.exports = {
  signIn,
  signUp,
  getAllUsers,
};
