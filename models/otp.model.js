const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    otp: {
      type: Number,
      unique: true,
      required: [true, "Otp is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Otp = model("Otp", otpSchema);

module.exports = Otp;
