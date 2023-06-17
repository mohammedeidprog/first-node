const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name required")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];
