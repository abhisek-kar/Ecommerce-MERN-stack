const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const {
  fetchAllBrandsController,
  createBrandController,
} = require("../controllers/brandController");

const router = express.Router();
//  /brands is already added in base path
// router.get("/", fetchBrands).post("/", createBrand);

// get all brands || GET || user, admin
router.get("/", isAuthenticated, fetchAllBrandsController);

// create a brands || POST || admin
router.post("/", isAuthenticated, isAdmin, createBrandController);

module.exports = router;
