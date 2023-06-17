const express = require("express");
const {
  getAllCoupons,
  createNewCoupon,
  getSpecificCoupon,
  updateSpecificCoupon,
  deleteSpecificCoupon,
} = require("../services/couponService");

const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");
const {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../utils/validators/couponValidator");

const router = express.Router();
router.use(isAuthenticated, allowedRoles("admin", "manager"));
router
  .route("/")
  .get(getAllCoupons)
  .post(createCouponValidator, createNewCoupon);

router
  .route("/:id")
  .get(getCouponValidator, getSpecificCoupon)
  .put(updateCouponValidator, updateSpecificCoupon)
  .delete(deleteCouponValidator, deleteSpecificCoupon);

module.exports = router;
