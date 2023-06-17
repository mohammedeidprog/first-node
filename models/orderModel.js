const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "order must be belong to user"],
    },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        color: String,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],

    totalOrderPrice: Number,

    taxPrice: { type: Number, default: 0 },

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user.addresses",
    },

    shippingPrice: { type: Number, default: 0 },

    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name phone" }).populate({
    path: "items.product",
    select: "title quantity",
  });
  next();
});
module.exports = mongoose.model("Order", orderSchema);
