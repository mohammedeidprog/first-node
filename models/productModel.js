const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "too short product title"],
      maxLength: [100, "too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minLength: [20, "too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      maxLength: [10, "too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "image cover is required"],
    },
    images: [String],
    category: {
      type: Schema.ObjectId,
      ref: "Category",
      required: [true, "product must be belonged to category"],
    },
    subcategories: {
      type: [mongoose.Schema.ObjectId],
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingAverage: {
      type: Number,
      min: [1, "Rating must be bigger than or equal to 1.0"],
      max: [5, "Rating must be less than or equal to 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name slug",
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.image}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    // doc.images.forEach((image, index) => {
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
      // doc.images[index] = imageUrl;
    });
    doc.images = imagesList;
  }
};

productSchema.post("init", (doc) => {
  setImageURL(doc);
});

productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
