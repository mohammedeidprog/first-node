const express = require("express");
const {
  createSubCategory,
  getAllSubCategories: getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSpecificSubCategory: deleteSubCategory,
  setCategoryIdToBody,
  setFilterObjectToReq,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");

/**
 * @mergeParams   allow us to access params on other routers
 * @example       we need to access categoryId from categoryRoute
 */
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    isAuthenticated,
    allowedRoles("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(setFilterObjectToReq, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    isAuthenticated,
    allowedRoles("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    isAuthenticated,
    allowedRoles("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
