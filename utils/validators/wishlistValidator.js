const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const Product = require("../../models/productModel");

exports.addProductToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("invalid Product id format")
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        console.log("Product not found");
        return Promise.reject(new Error("there is no product for this id"));
      }
      console.log("Product found successfully");
      return true;
    }),
  validatorMiddleware,
];
