const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

const Category = require("../models/categoryModel");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${req.body.slug}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  req.body.image = fileName;
  next();
});

/**
 * @desc    get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getAllCategories = factory.getAllOf(Category);

/**
 * @desc    get specific category by id
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
exports.getCategory = factory.getOne(Category);
/**
 * @desc    Create category
 * @route   POST    /api/v1/categories
 * @access  Private
 */
exports.createCategory = factory.createNew(Category);

/**
 * @desc    update specific category by id
 * @route   PUT /api/v1/categories/:id
 * @access  Private
 */
exports.updateCategory = factory.updateOne(Category);

/**
 * @desc    delete specific category by id
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
exports.deleteCategory = factory.deleteOne(Category);
