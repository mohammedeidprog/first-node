const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("too short SubCategory name")
    .isLength({ max: 32 })
    .withMessage("too long SubCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belonged to category")
    .isMongoId()
    .withMessage("Invalid Category id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  check("category").isMongoId().withMessage("invalid Category id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  validatorMiddleware,
];
