const UserModel = require("../models/User");

exports.fetchUserByIdController = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "No ID Provided",
      });
    }
    const user = await UserModel.findById(id);
    return res.status(200).json({
      success: true,
      message: "Fetched User Details Successfully",
      id: user.id,
      addresses: user.addresses,
      email: user.email,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Fetch User API",
    });
  }
};

exports.updateUserController = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "No ID Provided",
      });
    }
    // prevent changing the role of the user
    if (req.body.role) {
      req.body.role = undefined;
    }
    const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
      success: true,
      message: "Updated User Details Successfully",
      user: {
        addresses: user.addresses,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Update User API",
    });
  }
};
