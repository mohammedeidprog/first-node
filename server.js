const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
const mountRoutes = require("./routes");
const globalError = require("./middleware/errorMiddleware");
const ApiError = require("./utils/apiError");

// connect with database
mongoose.set("strictQuery", false);

// mongoose.connect(process.env.DB_URI);

dbConnection();

// express app
const app = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
console.log(`mode: ${process.env.NODE_ENV}`);

// mount routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

// unhandled rejection errors outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("shutting down ... ");
    process.exit(1);
  });
});
