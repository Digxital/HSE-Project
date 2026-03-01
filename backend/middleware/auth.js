const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
 
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
      data: {}
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({
        success: false,
        message: "Account is not active. Contact admin.",
        data: {}
      });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      data: {}
    });
  }
};