const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // multer diskStorage engine
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const extension = file.mimetype.split("/")[1];
  //     const fileName = `category-${req.body.name}-${Date.now()}.${extension}`;
  //     cb(null, fileName);
  //   },
  // });

  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images Allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (fieldsArray) =>
  multerOptions().fields(fieldsArray);
