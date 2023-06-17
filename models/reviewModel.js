const mongoose = require("mongoose");
const Product = require("./productModel");
// 1- Create Schema
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [0, "min length is 0"],
      max: [5, "max length is 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "no user to comment with"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "no product to comment on"],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAvgRatingAndQuantity = async function (productId) {
  const statistics = await this.aggregate([
    {
      // stage 1 : get all reviews on specific product
      $match: { product: productId },
    },
    // stage 2 : grouping reviews based on productId and calculate ratings statistics
    {
      $group: {
        _id: `$product`,
        avgRating: { $avg: `$rating` },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  console.log(statistics);
  if (statistics.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: statistics[0].avgRating,
      ratingsQuantity: statistics[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post(
  "deleteOne",
  { document: true, query: false }, // the most important line to trigger remove method
  async function () {
    console.log("remove triggered");
    await this.constructor.calcAvgRatingAndQuantity(this.product);
  }
);

reviewSchema.post("save", async function () {
  console.log("save triggered");
  console.log(this instanceof mongoose.Query);
  await this.constructor.calcAvgRatingAndQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
