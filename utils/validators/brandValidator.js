const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 1 })
    .withMessage("too short Brand name")
    .isLength({ max: 32 })
    .withMessage("too long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validatorMiddleware,
];
