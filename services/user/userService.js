const sharp = require("sharp");
const bcrypt = require("bcrypt");

const asyncHandler = require("express-async-handler");
const factory = require("../handlersFactory");
const { uploadSingleImage } = require("../../middleware/uploadImageMiddleware");
const ApiError = require("../../utils/apiError");
const generateToken = require("../../utils/generateToken");

const User = require("../../models/userModel");
const Cart = require("../../models/cartModel");
const Order = require("../../models/orderModel");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `user-${req.body.name}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    req.body.profileImg = fileName;
    // console.log(req.rawHeaders[9]); // print localhost:8000
  }
  next();
});

/**
 * @desc    get list of Users
 * @route   GET /api/v1/users
 * @access  Private
 */
exports.getAllUsers = factory.getAllOf(User);

/**
 * @desc    get specific User by id
 * @route   GET /api/v1/users/:id
 * @param   {String} id
 * @access  Private
 */
exports.getSpecificUser = factory.getOne(User);

/**
 * @desc    Create User
 * @route   POST   /api/v1/users
 * @access  Private
 */
exports.createNewUser = factory.createNew(User);

/**
 * @desc    update specific User by id
 * @route   PUT /api/v1/users/:id
 * @param   { String } id
 * @access  Private
 */
exports.updateSpecificUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      active: req.body.active,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`no user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

/**
 * @desc    change User password
 * @route   PUT /api/v1/users/changePassword/:id
 * @param   { String } id
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`no document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

/**
 * @desc    deactivate specific User by id
 * @route   LOCK /api/v1/users/:id
 * @param   { String } id
 * @access  Private
 */
exports.deactivateSpecificUser = factory.deactivateUser(User);

/**
 * @desc    activate my profile
 * @route   GET /api/v1/users/activateMe
 * @access  Private/Protected
 */
exports.activateMyProfile = (active) =>
  asyncHandler(async (req, res, next) => {
    console.log(`active: ${active}`);
    if (typeof active !== "boolean") {
      return next(new ApiError("invalid parameter active", 400));
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      active,
    });

    if (!user) {
      return next(new ApiError("this user is not exist", 404));
    }
    const token = generateToken(req.user._id);

    res.status(200).json({ active: active, token });
  });
/**
 * @desc    activate specific User by id
 * @route   UNLOCK /api/v1/users/:id
 * @param   { String } id
 * @access  Private
 */
exports.activateSpecificUser = factory.activateUser(User);

/**
 * @desc    get logged user details
 * @route   GET /api/v1/users/profile
 * @access  Private/Protected
 */
exports.getLoggedUserInformation = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  console.log(`uid: ${id}`);
  const document = await User.findById(id);
  if (!document) {
    return next(new ApiError(`no document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

/**
 * @desc    update logged user details
 * @route   PUT /api/v1/users/updateProfile
 * @access  Private/Protected
 */
exports.updateLoggedUserInformation = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findByIdAndUpdate(
    id,
    {
      email: req.body.email,
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`no user for this id ${id}`, 404));
  }
  res.status(200).json({ data: user });
});

/**
 * @desc    change logged user details
 * @route   PUT /api/v1/users/profile
 * @access  Private/Protected
 */
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

/**
 * @desc    get logged user cart
 * @route   GET /api/v1/users/cart
 * @access  Private/Protected
 */
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const cart = await Cart.findOne({ user: id });
  if (!cart) {
    return next(new ApiError(`no cart for this user ${id}`, 404));
  }
  res.status(200).json({ data: cart });
});

/**
 * @desc    get logged user orders
 * @route   GET /api/v1/users/orders
 * @access  Private/Protected(user)
 */
exports.getLoggedUserOrders = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const cart = await Order.find({ user: id });
  if (!cart) {
    return next(new ApiError(`no cart for this user ${id}`, 404));
  }
  res.status(200).json({ data: cart });
});

/**
 * @desc    clear logged user cart
 * @route   DELETE /api/v1/users/cart
 * @access  Private/Protected
 */
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send("cart cleared");
});
