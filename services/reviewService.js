const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

/**
 * @desc    middleware to set product from params product id
 * @route   POST    /api/v1/products/:productId/reviews
 * @param   {String} id
 * @access  Private/Protected (User only)
 */
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (req.params.productId) req.body.product = req.params.productId;
  if (req.user._id) req.body.user = req.user._id;
  next();
};

/**
 * @desc    Create review
 * @route   POST    /api/v1/reviews
 * @access  Private/Protected (User only)
 */
exports.createNewReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    title: req.body.title,
    rating: req.body.rating,
    product: req.body.product,
    user: req.body.user,
  });
  res.status(201).json({ data: review });
});
/**
 * @desc    get list of reviews
 * @route   GET /api/v1/reviews
 * @access  Public
 */
exports.getAllReviews = factory.getAllOf(Review);

/**
 * @desc    get specific Review by id
 * @route   GET /api/v1/reviews/:id
 * @param   {String} id
 * @access  Public
 */
exports.getSpecificReview = factory.getOne(Review);

/**
 * @desc    update specific review by id
 * @route   PUT /api/v1/reviews/:id
 * @param   { String } id
 * @access  Private/Protected (User only)
 */
exports.updateSpecificReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!review) {
    return next(new ApiError(`no review for this id ${req.params.id}`, 404));
  }
  // trigger "save" method to calculate avg and sum
  review.save();
  res.status(200).json({ data: review });
});
/**
 * @desc    delete specific review by id
 * @route   DELETE /api/v1/reviews/:id
 * @param   { String } id
 * @access  Private/Protected (User, Admin, Manager)
 */
exports.deleteSpecificReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    return next(new ApiError(`no review for this id ${id}`, 404));
  }
  // trigger "remove" method to calculate avg and sum
  review.deleteOne();
  res.status(204).send("removed");
});

/**
 * @desc    middleware to set filter object from params product id
 * @route   GET    /api/v1/products/:productId/reviews
 * @param   {String} id
 * @access  Private/Protected (user only)
 */
exports.setFilterToReq = (req, res, next) => {
  let filterObject = {};
  console.log("params: ", req.params);
  if (req.params.productId) {
    console.log(req.params);
    filterObject = { product: req.params.productId };
  }
  req.filterObject = filterObject;
  next();
};
