const bcrypt = require("bcryptjs");
const { createAuthenticationToken } = require("../auth/authFunctions");
const User = require("../models/user.model");
const { createOne, getAll } = require("./generic.controller");
const Otp = require("../models/otp.model");
const nodemailer = require("nodemailer");

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

// Sign up
const signUp = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    createAuthenticationToken(user, res, 201);
  } catch (err) {
    // Return valid error if username or email already exists
    if (err.code === 11000) {
      // Duplicate key error (username or email already exists)
      return res.status(400).json({
        status: "failure",
        message: `The ${Object.keys(err.keyValue)} already exists`,
      });
    }

    res.status(400).json({
      status: "failure",
      message: err.message ? err.message : "Internal Server error",
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    // Check if email exists
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check for existing otp and Delete Existing OTP (If Found)
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
      await Otp.deleteOne({ _id: existingOtp._id }); // Or similar delete method
    }

    // Generate Otp
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);
    const otp = await Otp.create({ email: user.email, otp: generatedOtp });

    // Send email with otp
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.MAIL_OPTIONS_USER,
        pass: process.env.MAIL_OPTIONS_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "Quiz App Facilitators",
        address: process.env.MAIL_OPTIONS_USER,
      },
      to: user.email,
      subject: "Reset Password Otp",
      text: `Your Otp is ${generatedOtp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Internal server error",
        });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          message: "Otp sent successfully",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    // Get otp, email and password
    const { otp, email, password } = req.body;
    const userOtp = await Otp.findOne({ email });
    if (!userOtp) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if the otp and email matches, then update password
    if (userOtp.otp == otp && userOtp.email == email) {
      const user = await User.findOne({ email });
      user.password = password;
      await user.save();

      // Delete the otp record so the same otp can't be used twice
      const deletedRecord = await Otp.findOneAndDelete({ email });

      return res.status(200).json({
        message: "Password updated successfully",
      });
    }

    return res.status(400).json({
      message: "Invalid Otp",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  signIn,
  signUp,
  getAllUsers,
  forgotPassword,
  resetPassword,
};
