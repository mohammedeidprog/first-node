const asyncHandler = require("express-async-handler");

const User = require("../../models/userModel");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Coupon = require("../../models/couponModel");
const ApiError = require("../../utils/apiError");

const calcCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.items.forEach((item) => {
    totalPrice += +item.totalPrice;
  });
  return totalPrice;
};

/**
 * @desc    add product to cart
 * @route   POST   /api/v1/cart
 * @access  Protected/User
 */
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // find user cart if exists
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // create new cart if not exist
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product: productId,
          color,
          unitPrice: product.price,
          quantity: 1,
          totalPrice: product.price,
        },
      ],
    });
  } else {
    // product exist in cart, update product quantity
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product.id && item.color === color
    );
    // console.log(itemIndex);
    if (itemIndex > -1) {
      // update quantity
      const cartItem = cart.items[itemIndex];
      cartItem.quantity += 1;
      cartItem.unitPrice = product.price;
      cartItem.totalPrice = cartItem.quantity * product.price;
      cart.items[itemIndex] = cartItem;
    } else {
      // push product to items array
      cart.items.push({
        product: productId,
        color,
        unitPrice: product.price,
        quantity: 1,
        totalPrice: product.price,
      });
    }

    const total = calcCartTotalPrice(cart);
    cart.totalCartPrice = total;
    cart.totalCartPriceAfterDiscount = total;
    cart.discount = 0;
    await cart.save();
  }

  res.status(200).json({
    status: "success",
    message: "product added successfully to your cart",
    data: cart,
  });
});

/**
 * @desc    remove product from cart
 * @route   DELETE   /api/v1/cart/:id
 * @params  id: item id
 * @access  Protected/User
 */
exports.deleteProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { items: { _id: req.params.id } },
    },
    { new: true }
  );
  cart.totalCartPrice = calcCartTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "product removed successfully from your cart",
    data: cart,
  });
});

/**
 * @desc    get user cart
 * @route   GET   /api/v1/cart
 * @access  Protected/User
 */
exports.getUserCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("cart");
  res.status(200).json({
    results: user.cart.length,
    data: user.cart,
  });
});

/**
 * @desc    update specific item quantity
 * @route   PUT   /api/v1/cart/:id
 * @access  Protected/User
 */
exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  // find user cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this id", 404));
  }
  // find cart item
  console.log(req.params);
  const itemIndex = cart.items.findIndex(
    (item) => req.params.id.toString() === item._id.toString()
  );
  // console.log(itemIndex);
  if (itemIndex > -1) {
    // update quantity
    const cartItem = cart.items[itemIndex];
    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * cartItem.unitPrice;
    cart.items[itemIndex] = cartItem;
  } else {
    return next(new ApiError("no item for this id", 404));
  }
  const total = calcCartTotalPrice(cart);
  cart.totalCartPrice = total;
  cart.totalCartPriceAfterDiscount = total;
  cart.discount = 0;
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "quantity updated successfully",
    data: cart.items[itemIndex],
  });
});

/**
 * @desc    apply coupon
 * @route   PUT   /api/v1/cart/applyCoupon
 * @access  Protected/User
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // find coupon and check is valid
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expireDate: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("this coupon is invalid", 404));
  }
  //   const now = new Date();
  //   if (coupon.expireDate < now.getTime()) {
  //     return next(new ApiError("this coupon is expired", 404));
  //   }

  // find user cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this id", 404));
  }
  const totalPrice = cart.totalCartPrice.toFixed(2);
  const discount = ((totalPrice * coupon.discount) / 100).toFixed(2);
  const totalPriceAfterDiscount = (totalPrice - discount).toFixed(2);
  cart.totalCartPriceAfterDiscount = totalPriceAfterDiscount;
  cart.discount = discount;
  await cart.save();
  res.status(200).json({
    results: `coupon ${coupon.name} (${coupon.discount}%) applied`,
    data: cart,
  });
});
