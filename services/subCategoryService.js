// const slugify = require("slugify");
// const asyncHandler = require("express-async-handler");

const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

/**
 * @desc    middleware to set category from params category id
 * @route   POST    /api/v1/categories/:categoryId/subcategories
 * @param   {String} id
 * @access  Private
 */
exports.setCategoryIdToBody = (req, res, next) => {
  if (req.params.categoryId) req.body.category = req.params.categoryId;
  next();
};

/**
 * @desc    middleware to set filter object from params category id
 * @route   GET    /api/v1/categories/:categoryId/subcategories
 * @param   {String} id
 * @access  Private
 */
exports.setFilterObjectToReq = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    console.log(req.params);
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

/**
 * @desc    Create subCategory
 * @route   POST    /api/v1/subcategories
 * @param   {String} id
 * @access  Private
 */
exports.createSubCategory = factory.createNew(SubCategory);

/**
 * @desc    get list of subCategories
 * @route   GET /api/v1/subcategories
 * @access  Public
 */
exports.getAllSubCategories = factory.getAllOf(SubCategory);
/**
 * @desc    get specific subCategory by id
 * @route   GET /api/v1/subcategories/:id
 * @param   {String} id
 * @access  Public
 */
exports.getSubCategory = factory.getOne(SubCategory);

/**
 * @desc    update specific subcategory by id
 * @route   PUT /api/v1/subcategories/:id
 * @param   {String} id
 * @access  Private
 */
exports.updateSubCategory = factory.updateOne(SubCategory);

/**
 * @desc    delete specific subCategory by id
 * @route   DELETE /api/v1/subcategories/:id
 * @param   {String} id
 * @access  Private
 */
exports.deleteSpecificSubCategory = factory.deleteOne(SubCategory);
