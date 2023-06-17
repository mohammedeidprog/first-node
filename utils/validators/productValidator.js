const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.CreateProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product title required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .notEmpty()
    .withMessage("product sold numbers is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price numbers is required")
    .isNumeric()
    .withMessage("Product quantity must be a number")
    .isLength({ max: 32 })
    .withMessage("too long product price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of strings"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("invalid category mongo ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          console.log("refused");
          return Promise.reject(
            new Error("this id is not belonged a real category in db")
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("invalid ID format")
    .custom((values, { req }) =>
      SubCategory.find({ _id: { $exists: true, $in: values } }).then(
        (result) => {
          if (result.length !== values.length) {
            return Promise.reject(
              new Error("some subcategories ids aren't real")
            );
          }
        }
      )
    )
    .custom((values, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subcategory) => {
            subCategoriesIdsInDB.push(subcategory._id.toString());
          });
          if (!values.every((value) => subCategoriesIdsInDB.includes(value))) {
            return Promise.reject(
              new Error(
                "some subcategories ids aren't belonged to the specified category"
              )
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("invalid ID format"),
  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratingsAverage must be between 1.0 and 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid Product id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalid Product id format"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .optional()
    .isFloat({ max: 32 })
    .withMessage("Product quantity must be a number")
    .withMessage("too long product price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of strings"),
  check("imageCover")
    .optional()
    .notEmpty()
    .withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("category").optional().isMongoId().withMessage("invalid ID format"),
  check("subcategory").optional().isMongoId().withMessage("invalid ID format"),
  check("brand").optional().isMongoId().withMessage("invalid ID format"),
  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratingsAverage must be a number"),
  //   .isLength({ min: 1 })
  //   .withMessage("ratingsAverage must be bigger than or equals to 1.0")
  //   .isLength({ max: 5 })
  //   .withMessage("ratingsAverage must be less than or equals to 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid Product id format"),
  validatorMiddleware,
];
