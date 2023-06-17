const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 1- Create Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name required"],
      minlength: [3, "too short name"],
      maxlength: [32, "too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: [true, "email must be unique"],
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [3, "too short password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    hashedResetCode: String,
    resetCodeExpiration: Date,
    resetCodeVerification: Boolean,
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.profileImg) {
    const profileImgUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = profileImgUrl;
  }
};

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  console.log("password hashed");
  return next();
});

userSchema.post("init", (doc) => {
  setImageURL(doc);
});

userSchema.post("save", (doc) => {
  setImageURL(doc);
});

// 2- Create model

module.exports = mongoose.model("User", userSchema);
