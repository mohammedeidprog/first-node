const express = require("express");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");
const {
  addProductToCart,
  deleteProductFromCart,
  updateItemQuantity,
  applyCoupon,
} = require("../services/user/cartService");

const router = express.Router({ mergeParams: true });
router.use(isAuthenticated, allowedRoles("user"));
router.route("/").post(addProductToCart);
router.route("/applyCoupon").put(applyCoupon);
router.route("/:id").put(updateItemQuantity).delete(deleteProductFromCart);
module.exports = router;
