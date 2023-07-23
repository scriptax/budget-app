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
  ref: "User",
  foreignField: "budget",
  localField: "_id"
});

budgetSchema.pre("save", function(next) {
  this.setAt = Date.now();
  next();
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;