const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

const Brand = require("../models/brandModel");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${req.body.name}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  req.body.image = fileName;
  // console.log(req.rawHeaders[9]); // print localhost:8000
  next();
});

/**
 * @desc    get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */
exports.getAllBrands = factory.getAllOf(Brand);

/**
 * @desc    get specific Brand by id
 * @route   GET /api/v1/brands/:id
 * @param   {String} id
 * @access  Public
 */
exports.getSpecificBrand = factory.getOne(Brand);

/**
 * @desc    Create brand
 * @route   POST    /api/v1/brands
 * @access  Private
 */
exports.createNewBrand = factory.createNew(Brand);

/**
 * @desc    update specific brand by id
 * @route   PUT /api/v1/brands/:id
 * @param   { String } id
 * @access  Private
 */
exports.updateSpecificBrand = factory.updateOne(Brand);
/**
 * @desc    delete specific brand by id
 * @route   DELETE /api/v1/brands/:id
 * @param   { String } id
 * @access  Private
 */
exports.deleteSpecificBrand = factory.deleteOne(Brand);
