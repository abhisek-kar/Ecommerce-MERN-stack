const express = require("express");

const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProductController,
  fetchAllProductsController,
  fetchProductByIdController,
  updateProductController,
} = require("../controllers/productController");

//  /products is already added in base path
// router
//   .post("/", createProduct)
//   .get("/", fetchAllProducts)
//   .get("/:id", fetchProductById)
//   .patch("/:id", updateProduct);
// // .get('/update/test',async(req,res)=>{
// //       // For adding discountPrice to existing data : delete this code after use
// //      const products = await Product.find({});
// //      for(let product of products){
// //       product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
// //       await product.save()
// //       console.log(product.title+ ' updated')
// //      }
// //      res.send('ok')
// // })

const router = express.Router();

// create product || POST ||admin
router.post(
  "/create-product",
  isAuthenticated,
  isAdmin,
  createProductController
);

// getAll products || GET
router.get("/", isAuthenticated, fetchAllProductsController);

// get product by ID || GET
router.get("/:id", isAuthenticated, fetchProductByIdController);

// get product by ID || PATCH
router.patch("/:id", isAuthenticated, isAdmin, updateProductController);

module.exports = router;
