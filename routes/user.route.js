const express = require("express");
const hashPassword = require("../auth/hashPassword");
const {
  signIn,
  signUp,
  getAllUsers,
} = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.route("/").post(hashPassword, signUp).get(getAllUsers);
userRouter.route("/signin").post(signIn);

module.exports = {
  userRouter,
};
