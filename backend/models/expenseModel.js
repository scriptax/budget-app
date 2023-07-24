const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Expense should have a name."]
  },
  amount: {
    type: Number,
    required: [true, "Expense must have an amount."]
  },
  setAt: Date,
  budget: {
    type: mongoose.Schema.ObjectId,
    ref: "Budget",
    required: [true, "Specify a budget category for the expense."]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "The exppense should belong to a user."]
  }
});

expenseSchema.pre("save", function(next) {
  this.setAt = Date.now();
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
