const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Income must have a name."],
  },
  amount: {
    type: Number,
    required: [true, "Income must have an amount."],
  },
  category: {
    type: String,
    required: [true, "Specify a category for the income."]
  },
  setAt: Date,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Income must belong to a user."],
  },
});

incomeSchema.pre("save", function (next) {
  this.setAt = Date.now();
  next();
});

incomeSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
