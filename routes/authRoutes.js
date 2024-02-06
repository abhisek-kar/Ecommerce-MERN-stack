const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  resetPasswordRequestController,
  resetPasswordController,
  checkAuthController,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();
//  /auth is already added in base path
// router
//   .post("/signup", createUser)
//   .post("/login", passport.authenticate("local"), loginUser)
//   .get("/check", passport.authenticate("jwt"), checkAuth)
//   .get("/logout", logout)
//   .post("/reset-password-request", resetPasswordRequest)
//   .post("/reset-password", resetPassword);

// register  ||  POST |
router.post("/register", registerController);

// login  ||  POST
router.post("/login", loginController);

// logut  ||  GET
router.get("/check", isAuthenticated, checkAuthController);

// logut  ||  GET
router.get("/logout", isAuthenticated, logoutController);

// logut  ||  GET
router.post("/reset-password-request", resetPasswordRequestController);

// logut  ||  GET
router.post("/reset-password", resetPasswordController);

module.exports = router;
