const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is a required field."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is a required field."],
    },
    role: {
      type: String,
      enum: ["creator", "participant"],
      default: "creator",
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is a required field."],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
