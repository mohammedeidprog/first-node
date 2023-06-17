const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ApiError = require("../apiError");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("invalid Coupon id format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name").notEmpty().withMessage("Coupon name required"),
  check("startDate")
    .notEmpty()
    .withMessage("coupon must have start date")
    .custom((val, { req }) => {
      const startDate = new Date(val);
      if (startDate <= Date.now()) {
        throw new ApiError("startDate is expired", 400);
      }
      return true;
    }),
  check("expireDate")
    .notEmpty()
    .withMessage("coupon must have expire date")
    .custom((val, { req }) => {
      const expireDate = new Date(val);
      const startDate = new Date(req.body.startDate);
      if (expireDate <= startDate) {
        throw new Error("expire date must be after start date");
      }
      return true;
    }),
  check("discount")
    .notEmpty()
    .withMessage("coupon must have discount")
    .isInt({ min: 1, max: 80 })
    .withMessage("discount must be a number between 1 and 80"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("startDate")
    .optional()
    .custom((val, { req }) => {
      const startDate = new Date(val);
      if (startDate <= Date.now()) {
        throw new ApiError("startDate is expired", 400);
      }
      return true;
    }),
  check("expireDate")
    .optional()
    .custom((val, { req }) => {
      const expireDate = new Date(val);
      const startDate = new Date(req.body.startDate);
      if (expireDate <= startDate) {
        throw new Error("expire date must be after start date");
      }
      return true;
    }),
  check("discount")
    .optional()
    .isInt({ min: 1, max: 80 })
    .withMessage("discount must be a number between 1 and 80"),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("invalid Coupon id format"),
  validatorMiddleware,
];
