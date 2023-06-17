const express = require("express");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");
const {
  createCashOrder,
  getAllOrders,
  updateOrderStatusToPaid,
  updateOrderStatusToDelivered,
} = require("../services/user/orderService");

const router = express.Router({ mergeParams: true });
// router.use(isAuthenticated, allowedRoles("user"));
router
  .route("/")
  .get(isAuthenticated, allowedRoles("admin"), getAllOrders)
  .post(isAuthenticated, allowedRoles("user"), createCashOrder);
// router.route("/applyCoupon").put(applyCoupon);
router
  .route("/:id/pay")
  .put(isAuthenticated, allowedRoles("admin"), updateOrderStatusToPaid);
router
  .route("/:id/deliver")
  .put(isAuthenticated, allowedRoles("admin"), updateOrderStatusToDelivered);
module.exports = router;
