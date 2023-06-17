const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const User = require("../../models/userModel");

exports.addAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("you must specify an alias")
    .custom(async (val, { req }) => {
      // console.log("alias validation1: ", val);
      const currentUser = await User.findById(req.user._id);
      currentUser.addresses.forEach((address) => {
        // console.log("alias validation2: ", address.alias);
        if (address.alias === val) {
          // console.log("address exists");
          throw new Error(`${val} address already exists`);
        }
      });
      return true;
    }),
  check("details").notEmpty().withMessage("you must specify address details"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "en-US", "fr-FR"])
    .withMessage("This phone number is not supported"),
  check("city").optional(),
  check("postalCode").optional(),
  validatorMiddleware,
];
