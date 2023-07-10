const Order = require("../models/order");
const Product = require("../models/product"); // for updating stock
const bigpromise = require("../middleware/big_promise");
const CustomError = require("../utils/coustom_error");
const product = require("../models/product");

exports.createOrder = bigpromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItem,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItem,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.orderInfo = bigpromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new CustomError("No product found", 401));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.userOrder = bigpromise(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });

  if (!order) {
    return next(new CustomError("No product found", 401));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.allOrders = bigpromise(async (req, res, next) => {
  const order = await Order.find();
  res.status(200).json({
    success: true,
    order,
  });
});

exports.allOrders = bigpromise(async (req, res, next) => {
  const order = await Order.find();
  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminUpdate = bigpromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (req.body.status === "delivered") {
    return next(new CustomError("Order is already delivered", 401));
  }

  order.orderStatus = req.body.status;
  order.orderItem.forEach(async (val) => {
    await updateStock(val.product, val.quantity);
  });
  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

exports.deleteOrder = bigpromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    await order.deleteOne();
  
    res.status(200).json({
      success: true,
    });
  });

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}



