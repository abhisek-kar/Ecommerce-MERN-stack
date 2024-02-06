const BrandModel = require("../models/Brand");

exports.fetchAllBrandsController = async (req, res) => {
  try {
    const brands = await BrandModel.find({});
    if (!brands) {
      return res.status(404).json({
        success: false,
        message: "No Brands Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Brands Found Successfully",
      brands,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in Fetch Brand API",
    });
  }
};

// create brand controller
exports.createBrandController = async (req, res) => {
  try {
    // check if brand exists or not
    const brand = await BrandModel.findOne({
      label: req.body.label,
      value: req.body.value,
    });
    if (brand) {
      return res.status(400).json({
        success: false,
        message: "Brand Already Exists",
      });
    }
    const newBrand = new BrandModel(req.body);
    await newBrand.save();
    newBrand._id = undefined;
    newBrand.id = undefined;
    return res.status(201).json({
      success: true,
      message: "Brand Created Successfully",
      brand: newBrand,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Create Brand API",
    });
  }
};
