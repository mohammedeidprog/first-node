const express = require("express");
const {
  getAllUsers,
  createNewUser,
  getSpecificUser,
  updateSpecificUser,
  activateSpecificUser,
  deactivateSpecificUser,
  uploadUserImage,
  resizeImage,
  changePassword,
  getLoggedUserInformation,
  changeLoggedUserPassword,
  updateLoggedUserInformation,
  getLoggedUserCart,
  clearLoggedUserCart,
  getLoggedUserOrders,
  activateMyProfile,
} = require("../services/user/userService");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  checkUserId,
  confirmOldAndNewPassword,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");
const {
  isAuthenticated,
  isActivated,
} = require("../services/user/authService");

const router = express.Router();

// protected routes
router.use(isAuthenticated);
router.get("/activateMe", activateMyProfile(true));

router.use(isActivated);
router
  .route("/changeMyPassword/")
  .put(changeLoggedUserPassword, confirmOldAndNewPassword, changePassword);
router.get("/profile", getLoggedUserInformation);
router.route("/cart").get(getLoggedUserCart).delete(clearLoggedUserCart);
router.route("/orders").get(getLoggedUserOrders);
router.get("/deActivateMe", activateMyProfile(false));
router.put(
  "/updateProfile",
  updateLoggedUserValidator,
  updateLoggedUserInformation
);

router
  .route("/changePassword/:id")
  .put(checkUserId, confirmOldAndNewPassword, changePassword);

// admin routes
// router.use(allowedRoles("admin"));
router
  .route("/:id")
  .get(getUserValidator, getSpecificUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateSpecificUser)
  .lock(checkUserId, deactivateSpecificUser)
  .unlock(checkUserId, activateSpecificUser);
router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createNewUser);
module.exports = router;
