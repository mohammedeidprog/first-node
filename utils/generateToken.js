const jwt = require("jsonwebtoken");

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRED_IN,
  });

module.exports = generateToken;
