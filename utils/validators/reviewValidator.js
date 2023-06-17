const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Review = require("../../models/reviewModel");
const Product = require("../../models/productModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratings value must be between 1 and 5"),
  check("user").isMongoId().withMessage("invalid USER id format"),
  check("product")
    .isMongoId()
    .withMessage("invalid PRODUCT id format")
    .custom((val, { req }) =>
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      )
    )
    .custom((val, { req }) =>
      Product.findById(val).then((product) => {
        if (!product) {
          return Promise.reject(
            new Error(`There is no product for this id : ${val}`)
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom((val, { req }) =>
      // check if current user is the owner of this review
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("There is no review for this ID"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratings value must be between 1 and 5"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        // check if current user is the owner of this review
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("There is no review for this ID"));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform this action")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
