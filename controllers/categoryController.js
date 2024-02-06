const CategoryModel = require("../models/Category");

exports.fetchCategoriesController = async (req, res) => {
  try {
    const categories = await CategoryModel.find({}).exec();
    if (!categories) {
      return res.status(200).json({
        success: true,
        message: "No Categories Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Fetched All Categories",
      categories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Fetch Categories API",
    });
  }
};

exports.createCategoryController = async (req, res) => {
  try {
    const { label, value } = req.body;
    // check categories exists or not
    const category = await CategoryModel.findOne({
      label: label,
      value: value,
    });
    if (category) {
      return res.status(400).json({
        success: false,
        message: "Categories Already Exists",
      });
    }
    const newCategory = new CategoryModel(req.body);
    await category.save();
    return res.status(201).json({
      success: true,
      message: "SuccessFully Created A Category",
      category: newCategory,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Fetched All Categories",
    });
  }
};
