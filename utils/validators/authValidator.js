const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModel");
const ApiError = require("../apiError");

exports.signupValidator = [
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

exports.loginValidator = [
  // : 1- validate if body contains email & password => validation layer
  check("email").notEmpty().withMessage("Email is required"),
  check("password").notEmpty().withMessage("Password is required"),
  validatorMiddleware,
];
