const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const {
  createOrderController,
  fetchAllOrdersController,
  cancelOrderController,
  fetchOrdersByUserController,
  updateOrderController,
} = require("../controllers/orderController");

const router = express.Router();

// create Order || POST || user
router.post("/create-order", isAuthenticated, createOrderController);

// fetch order by user || GET || user
router.get("/own", isAuthenticated, fetchOrdersByUserController);

// cancel Order || DELETE || user
router.delete("/:id", isAuthenticated, cancelOrderController);

// update Order || PATCH || user
router.patch("/:id", isAuthenticated, updateOrderController);

// create Order || GET || Admin
router.get("/", isAuthenticated, isAdmin, fetchAllOrdersController);

module.exports = router;
