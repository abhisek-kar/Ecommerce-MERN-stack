const ProductModel = require("../models/Product");
const mongoose = require("mongoose");

// create new product || admin
exports.createProductController = async (req, res) => {
  try {
    // console.log(req.body);
    const { title } = req.body;
    // check product title already exists or not
    const product = await ProductModel.findOne({ title });
    if (product) {
      return res.status(400).json({
        success: false,
        message: "Product Already Exists",
      });
    }
    // otherwise create new product
    const newProduct = new ProductModel(req.body);
    newProduct.discountedPrice = Math.round(
      newProduct.price * (1 - newProduct.discountPercentage / 100)
    );
    await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Successfully Created a Product",
      product: newProduct,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Create Product API",
    });
  }
};

// fetch all products || admin, user
exports.fetchAllProductsController = async (req, res) => {
  try {
    const { category, brand, _sort, _order, _page, _limit } = req.query;
    const { role } = req.user;
    let conditions = {};

    // deleted products only visible to admin
    if (role !== "admin") {
      conditions.deleted = { $ne: true };
    }

    let query = ProductModel.find(conditions);
    let totalProductsQuery = ProductModel.find(conditions);

    if (category) {
      query = query.where({ category: { $in: category.split(",") } });
      totalProductsQuery = totalProductsQuery.where({
        category: { $in: category.split(",") },
      });
    }

    if (brand) {
      query = query.where({ brand: { $in: brand.split(",") } });
      totalProductsQuery = totalProductsQuery.where({
        brand: { $in: brand.split(",") },
      });
    }

    if (_sort && _order) {
      query = query.sort({ [_sort]: _order });
    }

    const totalProducts = await totalProductsQuery.countDocuments();

    if (totalProducts === 0) {
      return res.status(200).json({
        success: true,
        message: "No Products To Show",
      });
    }

    if (_page && _limit) {
      const pageSize = Number(_limit);
      const page = Number(_page);

      if (!isNaN(pageSize) && !isNaN(page)) {
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid page or limit parameter" });
      }
    }

    const products = await query.exec();

    return res.status(200).json({
      success: true,
      message: "Successfully Fetched All Products",
      totalProducts,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error in Fetch Product API",
    });
  }
};

// fetch the product By Product ID || admin , user
exports.fetchProductByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    // check whether id is available or not
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID Is Required",
      });
    }
    // Handle invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Fetched The Product",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in Fetch Product API",
    });
  }
};

// update the product by id || admin
exports.updateProductController = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID Is Required",
      });
    }
    // Handle invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    product.discountedPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );
    const updatedProduct = await product.save();
    return res.status(200).json({
      success: true,
      message: "Successfully Updated The Product",
      product: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in Update Product API",
    });
  }
};
