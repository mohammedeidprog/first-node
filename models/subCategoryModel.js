const { default: mongoose } = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minLength: [2, "too short subcategory name"],
      maxLength: [32, "too long subcategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      // type: mongoose.Schema.ObjectId,
      type: String,
      ref: "Category",
      required: [true, "subcategory must have a parent category"],
    },
  },
  { timestamps: true }
);

const subCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = subCategory;
