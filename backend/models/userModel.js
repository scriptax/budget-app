const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return this.password === el;
        },
        message: "Passwords are not the same!",
      },
    },
    currentBalance: {
      type: Number,
      required: [true, "Please enter the amount of money you want to budget"],
    },
    preferredCurrency: {
      type: String,
      required: [true, "Please select your currency"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("budgets", {
  ref: "Budget",
  foreignField: "user",
  localField: "_id",
});
userSchema.virtual("expenses", {
  ref: "Expense",
  foreignField: "user",
  localField: "_id",
});
userSchema.virtual("incomes", {
  ref: "Income",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  // Check if password is to be modified
  // console.log("password enctypted")
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  // points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.passwordCorrectness = async function (
  givenPassword,
  actualPassword,
) {
  return await bcrypt.compare(givenPassword, actualPassword);
};

// Making sure password hasn't changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changeTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
