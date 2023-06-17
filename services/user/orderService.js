const asyncHandler = require("express-async-handler");

const factory = require("../handlersFactory");
const Order = require("../../models/orderModel");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const ApiError = require("../../utils/apiError");

/**
 * @desc    create cash order
 * @route   POST   /api/v1/order/
 * @access  Protected/User
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // getting cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("no cart for this user", 404));
  // getting total price
  const cartPrice = cart.totalCartPriceAfterDiscount;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // creating cash order
  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // decrement quantity, increment sold times
  if (order) {
    const bulkOptions = cart.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    // clear cart
    await Cart.findByIdAndDelete(cart._id);
  }
  res.status(201).json({ status: "success", data: order });
});

/**
 * @desc    get all orders
 * @route   GET   /api/v1/order/
 * @access  Protected/Admin
 */
exports.getAllOrders = factory.getAllOf(Order);

/**
 * @desc    update order status to paid
 * @route   PUT   /api/v1/order/:id/pay
 * @access  Protected/Admin
 */
exports.updateOrderStatusToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

/**
 * @desc    update order status to paid
 * @route   PUT   /api/v1/order/:id/pay
 * @access  Protected/Admin
 */
exports.updateOrderStatusToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});
