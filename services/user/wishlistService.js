const asyncHandler = require("express-async-handler");

// const ApiError = require("../../utils/apiError");
const User = require("../../models/userModel");

/**
 * @desc    add product to wishlist
 * @route   POST   /api/v1/wishlist
 * @access  Protected/User
 */
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product added successfully to your wishlist",
    data: user.wishlist,
  });
});

/**
 * @desc    remove product from wishlist
 * @route   DELETE   /api/v1/wishlist
 * @access  Protected/User
 */
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product removed successfully from your wishlist",
    data: user.wishlist,
  });
});

/**
 * @desc    get user wishlist
 * @route   GET   /api/v1/wishlist
 * @access  Protected/User
 */
exports.getUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
