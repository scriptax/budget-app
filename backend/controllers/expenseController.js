const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/customError");
const Expense = require("./../models/expenseModel");
const Budget = require("../models/budgetModel");
const mongoose = require("mongoose");
const User = require("./../models/userModel");

exports.appendUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getExpenses = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find({
    user: { $in: req.body.user },
    active: true,
  });

  if (!expenses) {
    return next(new CustomError("No expenses found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: expenses,
    },
  });
});

exports.createExpense = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const expense = await Expense.create([req.body], { session });
  await Promise.allSettled([
    User.findByIdAndUpdate(req.body.user, {
      $inc: { currentBalance: req.body.amount * -1 },
    }, { session }),
    Budget.findByIdAndUpdate(req.body.budget, {
      $inc: { spent: req.body.amount },
    }, { session }),
  ]);

  await session.commitTransaction();

  res.status(201).json({
    status: "success",
    data: {
      data: expense,
    },
  });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const expense = await Expense.findByIdAndDelete(req.params.id, { session });
  await Promise.allSettled([
    User.findByIdAndUpdate(req.body.user, {
      $inc: { currentBalance: await expense.amount },
    }, { session }),
    Budget.findByIdAndUpdate(expense.budget, {
      $inc: { spent: await expense.amount * -1 },
    }, { session })
  ]);

  if (!expense) {// need to  be placed right after const expense!
    return next(new CustomError("No expense found with this id.", 404)); 
  }

  await session.commitTransaction();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
