const ApiError = require("../utils/apiError");

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleJWTInvalidSignature = () =>
  new ApiError("Invalid token, please login again", 401);

const handleJWTExpired = () =>
  new ApiError("Token Expired, please login again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    // for development
    sendErrorForDev(err, res);
  } else {
    // for production
    if (err.name === "JsonWebTokenError") err = handleJWTInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJWTExpired();
    sendErrorForProd(err, res);
  }
};

// export default globalError;
module.exports = globalError;
