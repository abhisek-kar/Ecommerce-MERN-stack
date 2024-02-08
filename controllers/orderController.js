const sendEmail = require("../configs/nodemailer");
const OrderModel = require("../models/Order");
const CartModel = require("../models/Cart");
const ProductModel = require("../models/Product");
const UserModel = require("../models/User");
const { invoiceTemplate } = require("../services/common");

exports.fetchOrdersByUserController = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "No ID Provided",
      });
    }
    const orders = await OrderModel.find({ user: id });
    if (!orders) {
      return res.status(200).json({
        success: false,
        message: "You Haven't Ordered Yet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders Fetched Successfully",
      orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Fetch Order APi",
    });
  }
};

// create an order controller
exports.createOrderController = async (req, res) => {
  try {
    const newOrder = new OrderModel(req.body);

    // here we have to update stocks;
    // for (let item of newOrder.items) {
    //   let product = await ProductModel.findOne({ _id: item.product.id });
    //   product.$inc("stock", -1 * item.quantity);
    //   // for optimum performance we should make inventory outside of product.
    //   await product.save();
    // }

    await newOrder.save();
    const user = await UserModel.findById(newOrder.user);
    console.log("hi");
    // we can use await for this also
    sendEmail({
      to: user.email,
      html: invoiceTemplate(newOrder),
      subject: "Order Received",
      newOrder,
    });
    // empty the cart of user
    const { id } = req.user;
    const x = await CartModel.deleteMany({ user: id });
    console.log(x);
    return res.status(201).json({
      success: true,
      message: "Orders Created Successfully",
      newOrder,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error In Create Order API",
    });
  }
};

exports.cancelOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "No ID Provided",
      });
    }
    const order = await OrderModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Orders Cancelled Successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Cancel Order API",
    });
  }
};

exports.updateOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "No ID Provided",
      });
    }
    const order = await OrderModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "Order Updated Successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Cancel Order API",
    });
  }
};

exports.fetchAllOrdersController = async (req, res) => {
  try {
    // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10}
    let query = await OrderModel.find({ deleted: { $ne: true } });
    let totalOrdersQuery = await OrderModel.find({ deleted: { $ne: true } });

    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalOrders = await totalOrdersQuery.count().exec();
    console.log({ totalDocs });

    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const orders = await query.exec();
    return res.status(200).json({
      success: true,
      message: "All Orders Fetched",
      totalOrders,
      orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error In Fetch All Order API",
      order,
    });
  }
};
