const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const {
  fetchCategoriesController,
  createCategoryController,
} = require("../controllers/categoryController");

const router = express.Router();
//  /categories is already added in base path
// router.get("/", fetchCategories).post("/", createCategory);

// fetch all categories || GET || user,admin
router.get("/", isAuthenticated, fetchCategoriesController);

// fetch all categories || POST || admin
router.post("/", isAuthenticated, isAdmin, createCategoryController);

module.exports = router;
