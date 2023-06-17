const subCategoryRoute = require("./subCategoryRoute");
const categoryRoute = require("./categoryRoute");
const brandsRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewsRoute = require("./reviewsRoute");
const wishlistRoute = require("./wishlistRoute");
const addressesRoute = require("./addressesRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const ordersRoute = require("./orderRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandsRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewsRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressesRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/order", ordersRoute);
};

module.exports = mountRoutes;
