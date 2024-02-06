const express = require("express");
const { isAuthenticated, isUser } = require("../middlewares/authMiddleware");
const {
  addToCartController,
  fetchCartByUserController,
  deleteFromCartController,
  updateCartController,
} = require("../controllers/cartController");

const router = express.Router();

// add to cart || POST || user only
router.post("/", isAuthenticated, isUser, addToCartController);

// fetch cart By USER id || GET || user only
router.get("/", isAuthenticated, isUser, fetchCartByUserController);

// delete item from cart || DELETE || user only
router.delete("/:id", isAuthenticated, isUser, deleteFromCartController);

// update cart || PATCH || user only
router.patch("/:id", isAuthenticated, isUser, updateCartController);

module.exports = router;
