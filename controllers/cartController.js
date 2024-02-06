const CartModel = require("../models/Cart");

exports.fetchCartByUserController = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "No ID Provided",
      });
    }
    const cartItems = await CartModel.find({ user: id }).populate("product");
    if (!cartItems) {
      return res.status(200).json({
        success: true,
        message: "Cart Is Empty",
        cartItems: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart Items Fetched Succesfully",
      cartItems,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Fetch Cart API",
    });
  }
};

// exports.addToCartController = async (req, res) => {
//   try {
//     const { id } = req.user;
//     console.log(id);
//     if (!id) {
//       return res.status(401).json({
//         success: false,
//         message: "No ID Provided",
//       });
//     }
//     const cartItem = await new CartModel({ ...req.body, user: id }).populate(
//       "product"
//     );
//     // console.log(cartItem);
//     await cartItem.save();
//     return res.status(201).json({
//       success: true,
//       message: "Product Added to Cart",
//       cartItem,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Error In Add To Cart API",
//     });
//   }
// };
exports.addToCartController = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "No ID Provided",
      });
    }

    const cartItem = await CartModel.create({ ...req.body, user: id });

    // Assuming you have a reference to the 'Product' model in your 'CartModel' schema
    await cartItem.populate("product");

    return res.status(201).json({
      success: true,
      message: "Product Added to Cart",
      item: cartItem,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error In Add To Cart API",
    });
  }
};

exports.deleteFromCartController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "No ID Provided",
      });
    }
    const cartItem = await CartModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Product Deleted From Cart",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Delete From Cart API",
    });
  }
};

exports.updateCartController = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.body, id);
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "No ID Provided",
      });
    }
    // let cartExists = await CartModel.findOne({ id });
    // if (!cartExists) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Cart Not Found",
    //   });
    // }
    const cart = await CartModel.findByIdAndUpdate(
      id,
      { quantity: req.body.quantity },
      {
        new: true,
      }
    );
    const cartItem = await cart.populate("product");

    return res.status(200).json({
      success: true,
      message: "Product Updated In Cart",
      cartItem,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Update Cart API",
    });
  }
};
