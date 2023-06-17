const express = require("express");
const {
  getAllReviews,
  createNewReview,
  getSpecificReview,
  updateSpecificReview,
  deleteSpecificReview,
  setFilterToReq,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");
// const {
//   createReviewValidator,
//   getReviewValidator,
//   updateReviewValidator,
//   deleteReviewValidator,
// } = require("../utils/validators/reviewValidator");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(setFilterToReq, getAllReviews)
  .post(
    isAuthenticated,
    allowedRoles("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createNewReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getSpecificReview)
  .put(
    isAuthenticated,
    allowedRoles("user"),
    updateReviewValidator,
    updateSpecificReview
  )
  .delete(
    isAuthenticated,
    allowedRoles("admin", "manager", "user"),
    deleteReviewValidator,
    deleteSpecificReview
  );

module.exports = router;
