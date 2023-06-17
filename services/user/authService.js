const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const ApiError = require("../../utils/apiError");
const sendEmail = require("../../utils/sendEmail");
const generateToken = require("../../utils/generateToken");

/**
 * @desc    signup user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  //  1- create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //  2- generate token
  const token = generateToken(user._id);
  //  3- send response
  res.status(201).json({ data: user, token });
});

/**
 * @desc    login
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  //  1- validate if body contains email & password => validation layer
  //  2- check if email & password are correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new ApiError("invalid email or password", 406);
  }
  //  3- generate token
  const token = generateToken(user._id);
  //  4- send response
  res.status(202).json({ data: user, token });
});
/**
 * @desc    logout
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
// exports.logout = asyncHandler(async (req, res, next) => {
//   res.status(200).json({ token: undefined });
// });
/**
 * @desc    check if user Authenticated
 */
exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  // 1- check if token exists, if exists get it
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
    // console.log(token);
  } else {
    return next(new ApiError("not logged in", 401));
  }
  // 2- verify token (no change happened, not expired)
  const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  // console.log(`token: ${decoded}`);
  // 3- check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    throw new ApiError("This user does not exist", 401);
  }
  req.user = currentUser;
  // 4- check if user changed his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedLastTime = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedLastTime > decoded.iat) {
      // res.status(401).json({ msg: `Test completed successfully, no error` });
      return next(
        new ApiError("password changed recently, please login again", 401)
      );
    }
  }
  next();
});

/**
 * @desc    check if user NOT Authenticated
 */
exports.isNotAuthenticated = asyncHandler(async (req, res, next) => {
  // 1- check if token exists, if exists get it
  if (req.headers.authorization) {
    return next(new ApiError("already logged in", 401));
  }
  console.log(req.headers.authorization);
  next();
});

/**
 * @desc    check if user is active
 */
exports.isActivated = asyncHandler(async (req, res, next) => {
  if (!req.user.active) {
    // check if user active
    throw new ApiError("This user is not active", 401);
  }

  next();
});

/**
 * @desc    check if user role allows to access the route
 * @enum {string} admin manager user
 */
exports.allowedRoles = (
  ...roles // admin & manager & user
) =>
  asyncHandler(async (req, res, next) => {
    // check if user allowed to access this route
    console.log(`user role: ${req.user.role}`);
    if (roles.includes(req.user.role)) {
      next();
    } else {
      next(new ApiError("you are not allowed to access this route", 403));
    }
  });

/**
 * @desc    forget password
 * @route   POST /api/v1/auth/forgetPassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // check if req.body.email is exists in db
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new ApiError("this email is not found", 404));
  } else if (!user.active) {
    next(new ApiError("this user is not active", 403));
  }

  // generate random 6 digits
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // console.log(resetCode, hashedResetCode);
  // save hashed reset code into db
  user.hashedResetCode = hashedResetCode;
  // add expiration time to reset code and save it in db
  user.resetCodeExpiration = Date.now() + 10 * 60 * 1000;
  user.resetCodeVerification = false;
  await user.save();
  const currentdate = new Date();
  const datetime = `${currentdate.getDate()}/${
    currentdate.getMonth() + 1
  }/${currentdate.getFullYear()} at ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
  // and send it via email
  const message = `<h3>Hi, ${user.name}</h3>
  <h4>We received a request to reset the password on your E-Shop Account. </p>
  Your reset code is
  <h2>${resetCode}</h2>
  <h4>this code is valid for 10 minutes only.</p>
  <h4>Enter this code to complete the reset.</p>
  <h4>Thanks for helping us keep your account secure.</>
  <h4>The E-Shop Team  </h4>
  <h5>sent at: ${datetime}</h5>
  `;
  try {
    await sendEmail({
      to: "mohammad.eid.hassan@gmail.com",
      subject: "E-Shop reset code",
      message,
    });
    res
      .status(200)
      .json({ status: "Success", message: "Reset code send successfully" });
  } catch (err) {
    user.hashedResetCode = undefined;
    // add expiration time to reset code and save it in db
    user.resetCodeExpiration = undefined;
    user.resetCodeVerification = undefined;
    await user.save();
    return next(new ApiError(`error in sending message <${err.message}>`, 500));
  }
});

/**
 * @desc    verify reset code
 * @route   POST /api/v1/auth/verifyResetCode
 * @access  Public
 */
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const currentUser = await User.findOne({
    email: req.body.email,
  });
  if (currentUser) {
    const currentResetCodeExpiration = currentUser.resetCodeExpiration;

    if (
      !currentUser.resetCodeVerification &&
      hashedResetCode === currentUser.hashedResetCode &&
      Date.now() <= currentResetCodeExpiration
    ) {
      currentUser.resetCodeVerification = true;
      await currentUser.save();
      res
        .status(200)
        .json({ status: "success", message: "change password safely" });
    } else {
      console.log(!currentUser.resetCodeVerification);
      console.log(hashedResetCode === currentUser.hashedResetCode);
      console.log(Date.now() <= currentResetCodeExpiration);

      next(new ApiError("invalid or expired code", 500));
    }
  }
});

/**
 * @desc    reset password
 * @route   POST /api/v1/auth/resetPassword
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("user not exists", 404));
  }
  // check if reset code verified
  if (!user.resetCodeVerification) {
    return next(new ApiError("reset code not verified", 400));
  }
  // change password and set fields
  user.password = req.body.newPassword;
  user.hashedResetCode = undefined;
  user.resetCodeExpiration = undefined;
  user.resetCodeVerification = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();
  // generate new token
  const token = generateToken(user._id);
  // send response
  res.status(200).json({
    status: "success",
    message: "password changed successfully",
    token,
    _id: user._id,
  });
});
