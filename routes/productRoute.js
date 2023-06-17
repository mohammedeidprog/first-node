const express = require("express");
const {
  getAllProducts,
  createNewProduct,
  getSpecificProduct,
  updateSpecificProduct,
  deleteSpecificProduct,
  uploadMixOfImages,
  resizeProductImages,
} = require("../services/productService");
const {
  CreateProductValidator,
  getProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require("../utils/validators/productValidator");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");
const reviewRoute = require("./cartRoute");

const router = express.Router();

router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getAllProducts)
  .post(
    isAuthenticated,
    allowedRoles("admin", "manager"),
    uploadMixOfImages,
    resizeProductImages,
    CreateProductValidator,
    createNewProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getSpecificProduct)
  .put(
    isAuthenticated,
    allowedRoles("admin", "manager"),
    uploadMixOfImages,
    resizeProductImages,
    updateProductValidator,
    updateSpecificProduct
  )
  .delete(
    isAuthenticated,
    allowedRoles("admin"),
    deleteProductValidator,
    deleteSpecificProduct
  );

module.exports = router;
