const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

/**
 * @desc    get list of coupons
 * @route   GET /api/v1/coupons
 * @access  Private (admin - manager)
 */
exports.getAllCoupons = factory.getAllOf(Coupon);

/**
 * @desc    get specific Coupon by id
 * @route   GET /api/v1/coupons/:id
 * @param   {String} id
 * @access  Private (admin - manager)
 */
exports.getSpecificCoupon = factory.getOne(Coupon);

/**
 * @desc    Create coupon
 * @route   POST    /api/v1/coupons
 * @access  Private (admin - manager)
 */
exports.createNewCoupon = asyncHandler(async (req, res) => {
  req.body.name = slugify(req.body.name);
  //   req.body.startDate = new Date(req.body.startDate);
  const document = await Coupon.create({
    name: req.body.name.toString().toUpperCase(),
    startDate: new Date(req.body.startDate),
    expireDate: new Date(req.body.expireDate),
    discount: req.body.discount,
  });
  res.status(201).json({ data: document });
});

/**
 * @desc    update specific coupon by id
 * @route   PUT /api/v1/coupons/:id
 * @param   { String } id
 * @access  Private (admin - manager)
 */
exports.updateSpecificCoupon = asyncHandler(async (req, res, next) => {
  const document = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      startDate: req.body.startDate,
      expireDate: req.body.expireDate,
      discount: req.body.discount,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`no document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});
/**
 * @desc    delete specific coupon by id
 * @route   DELETE /api/v1/coupons/:id
 * @param   { String } id
 * @access  Private (admin - manager)
 */
exports.deleteSpecificCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    return next(new ApiError(`no coupon for this id ${id}`, 404));
  }
  // trigger "remove" method to calculate avg and sum
  coupon.deleteOne();
  res.status(204).send("removed");
});
