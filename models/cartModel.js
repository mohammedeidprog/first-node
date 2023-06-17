const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        color: String,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],
    totalCartPrice: Number,
    discount: { type: Number, default: 0 },
    totalCartPriceAfterDiscount: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Cart", cartSchema);
