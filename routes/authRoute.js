const express = require("express");
const {
  signup,
  login,
  // logout,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  isNotAuthenticated,
  isAuthenticated,
} = require("../services/user/authService");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();
router.route("/signup").post(isNotAuthenticated, signupValidator, signup);
router.route("/login").post(isNotAuthenticated, loginValidator, login);
// router.route("/logout").get(isAuthenticated, logout);
router.route("/forgotPassword").post(isAuthenticated, forgotPassword);
router.route("/verifyResetCode").post(isAuthenticated, verifyPassResetCode);
router.route("/resetPassword").put(isAuthenticated, resetPassword);

module.exports = router;
