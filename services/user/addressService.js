const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");

/**
 * @desc    add new address to addresses list
 * @route   POST   /api/v1/addresses
 * @access  Protected/User
 */
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    message: "address added successfully to your addresses",
    data: user.addresses,
  });
});

/**
 * @desc    remove address
 * @route   DELETE   /api/v1/wishlist
 * @access  Protected/User
 */
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.body.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    message: "address removed successfully",
    data: user.addresses,
  });
});

/**
 * @desc    get user addresses
 * @route   GET   /api/v1/wishlist
 * @access  Protected/User
 */
exports.getUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
