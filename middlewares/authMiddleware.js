const jwt = require("jsonwebtoken");

// authenticate user with tokens
exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: Invalid token" });
      }

      req.user = decoded;

      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//  check role admin - for admin only resources
exports.isAdmin = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role Not Provided",
      });
    }
    if (role === "admin") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Protected - Access Denied",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//  check role user - for user only resources
exports.isUser = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role Not Provided",
      });
    }
    if (role === "user") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Protected - Access Denied",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
