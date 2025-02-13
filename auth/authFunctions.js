const jwt = require("jsonwebtoken");

const createAuthenticationToken = async (req, res, status) => {
  const user = { ...req };
  const token = jwt.sign(user._doc, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  req.password = undefined;
  return res.status(status).json({
    success: true,
    token,
    user: req,
  });
};

const verifyJWTAuthToken = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Kindly login" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Unauthorized" });
    req.user = user;
    next();
  });
};

// A more generic role restriction middleware
const restrictTo = (allowedRolesArr) => (req, res, next) => {
  //console.log(req.user);
  if (!allowedRolesArr.includes(req.user.role)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = {
  verifyJWTAuthToken,
  createAuthenticationToken,
  restrictTo,
};
