const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");

exports.uploadMixOfImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  // image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `imageCover-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }
  // image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      // promise.all = async
      req.files.images.map(async (image, index) => {
        const imageFileName = `product-${Date.now()}-${index + 1}.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageFileName}`);

        req.body.images.push(imageFileName);
      })
    );
  }
  // console.log(req.body.images);
  // console.log(req.body.imageCover);
  next();
});

/**
 * @desc    get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getAllProducts = factory.getAllOf(Product); // end method

/**
 * @desc    get specific Product by id
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getSpecificProduct = factory.getOne(Product, "reviews");

/**
 * @desc    Create new product
 * @route   POST    /api/v1/products
 * @access  Private
 */
exports.createNewProduct = factory.createNew(Product);

/**
 * @desc    update specific product by id
 * @route   PUT /api/v1/products/:id
 * @access  Private
 */
exports.updateSpecificProduct = factory.updateOne(Product);

/**
 * @desc    delete specific product by id
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */
exports.deleteSpecificProduct = factory.deleteOne(Product);
