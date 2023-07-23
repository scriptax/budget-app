const catchAsync = require("./../utils/catchAsync");
const CustomError = require("./../utils/customError");
const User = require("./../models/userModel");
const Budget = require("./../models/budgetModel");
const Expense = require("./../models/expenseModel");

exports.appendUserIds = (req, res, next) => {
  if(!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: budget
    }
  });
});