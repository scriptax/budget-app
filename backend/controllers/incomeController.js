const catchAsync = require("./../utils/catchAsync");
const CustomError = require("./../utils/customError");
const Income = require("./../models/incomeModel");
const User = require("../models/userModel");

exports.appendUserIds = (req, res, next) => {
  if(!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getIncomes = catchAsync(async (req, res, next) => {
  const incomes = await Income.find({user: {$in: req.user.id}});

  if(!incomes) {
    return next(new CustomError("No incomes found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: incomes
    }
  });
});

exports.createIncome = catchAsync(async (req, res, next) => {
  const income = await Income.create(req.body);
  await User.findByIdAndUpdate(req.body.user, {$inc: {currentBalance: req.body.amount}});

  res.status(201).json({
    status: "success",
    data: {
      data: income
    }
  });
});

exports.deleteIncome = catchAsync(async (req, res, next) => {
  const income = await Income.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(req.body.user, {$inc: {currentBalance: income.amount * -1}});

  res.status(204).json({
    status: "success",
    data: null
  })
});