const { default: mongoose } = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
      unique: [true, "Coupon must be unique"],
    },
    startDate: {
      type: Date,
      required: [true, "Coupon start time required"],
    },
    expireDate: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount required"],
    },
  },
  { timestamps: true }
);
// couponSchema.post(
//   "deleteOne",
//   { document: true, query: false }, // the most important line to trigger remove method
//   () => {
//     console.log("remove triggered");
//     // await this.constructor.calcAvgRatingAndQuantity(this.product);
//   }
// );
module.exports = mongoose.model("Coupon", couponSchema);
