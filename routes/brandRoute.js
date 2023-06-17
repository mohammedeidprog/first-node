const express = require("express");
const {
  getAllBrands,
  createNewBrand,
  getSpecificBrand,
  updateSpecificBrand,
  deleteSpecificBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");

const router = express.Router();

router
  .route("/")
  .get(getAllBrands)
  .post(
    isAuthenticated,
    allowedRoles("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createNewBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getSpecificBrand)
  .put(
    isAuthenticated,
    allowedRoles("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateSpecificBrand
  )
  .delete(
    isAuthenticated,
    allowedRoles("admin"),
    deleteBrandValidator,
    deleteSpecificBrand
  );

module.exports = router;
