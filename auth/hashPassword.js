const bcrypt = require("bcryptjs");

const hashPassword = async (req, res, next) => {
  if (!req.body.password) return next();
  const salt = await bcrypt.genSalt(5);
  console.log("old: " + req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPassword;
  console.log("new: " + req.body.password);
  next();
};

module.exports = hashPassword;
