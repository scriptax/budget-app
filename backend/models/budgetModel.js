const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please specify a name for the budget."],
  },
  amount: {
    type: Number,
    required: [true, "Enter an amount  of money for the budget."]
  },
  setAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Budget must be assigned to a user"]
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

budgetSchema.virtual("expenses", {
  ref: "Expense",
  foreignField: "budget",
  localField: "_id"
});

budgetSchema.pre("save", function(next) {
  this.setAt = Date.now();
  next();
});

budgetSchema.pre(/^find/, function(next) {
  this.select("-__v");
  next();
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;