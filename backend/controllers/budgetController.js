const catchAsync = require("./../utils/catchAsync");
const CustomError = require("./../utils/customError");

const Budget = require("./../models/budgetModel");
const Expense = require("../models/expenseModel");

exports.appendUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.findById(req.params.id).populate({
    path: "expenses",
  });

  if (!budget) {
    return next(new CustomError("No item found with this id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: budget,
    },
  });
});

exports.createBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      budget,
    },
  });
});

exports.updateBudget = catchAsync(async (req, res, next) => {
  if (req.body.close) return next(); // Move on to closeBudget handler

  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!budget) {
    return next(new CustomError("No item found with this id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: budget,
    },
  });
});

exports.closeBudget = catchAsync(async (req, res, next) => {
  const oldBudget = await Budget.findByIdAndUpdate(req.params.id, {
    active: false,
  });

  if (!oldBudget) {
    return next(new CustomError("No item found with this id.", 404));
  }

  await Expense.updateMany(
    {
      budget: { $in: oldBudget._id },
    },
    {
      $set: { active: false },
    },
  );

  const newBudget = await Budget.create({
    name: oldBudget.name,
    amount: oldBudget.amount,
    user: req.body.user,
  });

  res.status(200).json({
    status: "success",
    data: {
      data: newBudget,
    },
  });
});

exports.deleteBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.findByIdAndDelete(req.params.id);

  if (!budget) {
    return next(new CustomError("No item found with this id.", 404));
  }

  await Expense.deleteMany({ budget: { $in: budget._id } });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
