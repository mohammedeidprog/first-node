/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const {
  getAllCategories: getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    isAuthenticated,
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    isAuthenticated,
    allowedRoles("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    isAuthenticated,
    allowedRoles("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

// nested route
router.use("/:categoryId/subcategories", subCategoryRoute);

module.exports = router;
