const express = require("express");
const {
  getUserAddresses,
  addAddress,
  removeAddress,
} = require("../services/user/addressService");
const {
  isAuthenticated,
  allowedRoles,
} = require("../services/user/authService");
const {
  addAddressValidator,
} = require("../utils/validators/addressesValidator");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, allowedRoles("user"), getUserAddresses)
  .post(isAuthenticated, allowedRoles("user"), addAddressValidator, addAddress)
  .delete(isAuthenticated, allowedRoles("user"), removeAddress);

module.exports = router;
