const express = require("express");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
  fetchUserByIdController,
  updateUserController,
} = require("../controllers/userController");
// const { fetchUserById, updateUser } = require('../controller/User');

const router = express.Router();
//  /users is already added in base path
// router.get("/own", fetchUserById).patch("/:id", updateUser);

// fetch user details || GET || user, admin
router.get("/own", isAuthenticated, fetchUserByIdController);

// update user details || PATCH || user, admin
router.patch("/:id", isAuthenticated, updateUserController);

module.exports = router;
