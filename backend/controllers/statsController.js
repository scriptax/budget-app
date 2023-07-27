const mongoose = require("mongoose");

const CustomError = require("./../utils/customError");
const catchAsync = require("./../utils/catchAsync");
const Expense = require("./../models/expenseModel");
const Income = require("./../models/incomeModel");
const Budget = require("../models/budgetModel");

const aggregateData = async(Model, req, filter) => {
  const id = new mongoose.Types.ObjectId(req.user.id);
  const pipeline = [
    {
      $match: {
        user: id,
        ...(filter != undefined && filter),
        setAt: {
          $gte: new Date(req.query.year, 0, 1), // January 1st of the specified year
          $lt: new Date(req.query.year + 1, 0, 1), // January 1st of the next year
        },
      }
    },
    {
      $group: {
        _id: {$month: "$setAt"},
        total: {$sum: "$amount"}
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ];


  const data = await Model.aggregate(pipeline);

  return data.map(item => ({
    month: item._id,
    total: item.total
  }));
};

exports.expenseData = catchAsync(async(req, res, next) => {
  const budgets = await Budget.find({category: {$in: req.query.category}});
  const budgetIds = budgets.map(budget => budget._id);
  const data = await aggregateData(Expense, req, 
    budgetIds.length && {budget: {$in: budgetIds}}
  );
  res.status(200).json({
    status: "success",
    data: {
      data
    }
  });
});

exports.incomeData = catchAsync(async (req, res, next) => {
  const data = await aggregateData(Income, req, 
    req.query.category && {category: {$in: [req.query.category]}}
  );
  res.status(200).json({
    status: "success",
    data: {
      data
    }
  });
});

exports.savingData = catchAsync(async (req, res, next) => {
  const expenseData = await aggregateData(Expense, req);
  const incomeData = await aggregateData(Income, req);

  const savingData = expenseData.map(expense => {
    const matchingIncome = incomeData.find(income => income.month === expense.month);
    const saving = matchingIncome.total - expense.total;
    const savingRate = Math.round((matchingIncome.total - expense.total) * 100 / matchingIncome.total);
    return {
      month: expense.month,
      saving, 
      savingRate
    };
  });

  res.status(200).json({
    status: "success",
    data: {
      data: savingData
    }
  });
});