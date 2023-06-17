const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 1 })
    .withMessage("too short User name")
    .isLength({ max: 32 })
    .withMessage("too long User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("invalid Email format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 3 })
    .withMessage("password too short")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Your password and confirmation do not match.");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter your password confirmation"),

  check("profileImg").optional(),

  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "en-US", "fr-FR"])
    .withMessage("This phone number is not supported"),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  check("profileImg").optional(),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid Email format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "en-US", "fr-FR"])
    .withMessage("This phone number is not supported"),

  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid Email format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "en-US", "fr-FR"])
    .withMessage("This phone number is not supported"),

  validatorMiddleware,
];

exports.checkUserId = [
  check("id").isMongoId().withMessage("invalid User id format"),
  validatorMiddleware,
];

exports.confirmOldAndNewPassword = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Please enter your current password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please confirm your new password"),
  check("newPassword")
    .notEmpty()
    .withMessage("Please enter your new password")
    .custom(async (val, { req }) => {
      console.log(req.body);
      // todo- verify current password
      const user = await User.findById(req.params.id);
      if (!user) throw new Error("User not found");
      const isCurrentPasswordCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCurrentPasswordCorrect)
        throw new Error("Current password is incorrect");
      // todo- verify new password and confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Your password and confirmation do not match.");
      }
      return true;
    }),
  validatorMiddleware,
];
