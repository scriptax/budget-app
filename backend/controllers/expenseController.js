const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/customError");
const Expense = require("./../models/expenseModel");
const User = require("./../models/userModel");

exports.appendUserIds = (req, res, next) => {
  if(!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getExpenses = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find({user: {$in: req.body.user}}); // need to tell it to exclude inactive ones

  if(!expenses) {
    return next(new CustomError("No expenses found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: expenses,
    }
  });
});

exports.createExpense = catchAsync(async(req, res, next) => {
  const expense = await Expense.create(req.body);
  await User.findByIdAndUpdate(req.body.user, {$inc: {currentBalance: req.body.amount * -1}});

  res.status(201).json({
    status: "success",
    data: {
      data: expense
    }
  })
});

exports.deleteExpense = catchAsync(async(req, res, next) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(req.body.user, {$inc: {currentBalance: await expense.amount}});

  if(!expense) {
    return next(new CustomError("No expense found with this id.", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  })
});