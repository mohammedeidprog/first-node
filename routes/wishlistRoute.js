const express = require("express");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getUserWishlist,
} = require("../services/user/wishlistService");
const {
  addProductToWishlistValidator,
} = require("../utils/validators/wishlistValidator");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, allowedRoles("user"), getUserWishlist)
  .post(
    isAuthenticated,
    allowedRoles("user"),
    addProductToWishlistValidator,
    addProductToWishlist
  )
  .delete(
    isAuthenticated,
    allowedRoles("user"),
    addProductToWishlistValidator,
    removeProductFromWishlist
  );

module.exports = router;
