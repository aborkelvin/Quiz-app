const express = require("express");
const hashPassword = require("../auth/hashPassword");
const {
  signIn,
  signUp,
  getAllUsers,
  forgotPassword,
  resetPassword,
} = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.route("/signup").post(hashPassword, signUp).get(getAllUsers);
userRouter.route("/signin").post(signIn);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/reset-password").post(hashPassword, resetPassword);

module.exports = {
  userRouter,
};
