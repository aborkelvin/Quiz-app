const nodemailer = require("nodemailer");

function sendMail(user) {
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
}

module.exports = sendMail;
