const mongoose = require("mongoose");

const catchAsync = require("./../utils/catchAsync");
const CustomError = require("./../utils/customError");
const User = require("./../models/userModel");
const Budget = require("./../models/budgetModel");

exports.getDashboard = catchAsync(async (req, res, next) => {
  // const user = await User.findById(req.user.id)
  //   .select("-__v")
  //   .populate({ path: "budgets", match: { active: true } })
  //   .populate({ path: "expenses", match: { active: true } })
  //   .populate({ path: "incomes" });
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const user = await User.aggregate([
    // Get user
    { $match: { _id: userId } },

    // Get user's incomes and calc the sum
    {
      $lookup: {
        from: 'incomes',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$userId'] },
                  { $gte: ['$setAt', new Date(year, month - 1, 1)] },
                  { $lt: ['$setAt', new Date(year, month, 1)] }
                ]
              }
            }
          },
        ],
        as: 'income'
      }
    },
    { $group: { _id: '$_id', name: { $first: '$name' }, email: { $first: '$email' }, currentBalance: { $first: "$currentBalance"}, preferredCurrency: { $first: "$preferredCurrency" }, totalIncome: {$first:{ $sum: '$income.amount'} } } },

    // Get user's expenses and calc the sum
    {
      $lookup: {
        from: 'expenses',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$userId'] },
                  { $gte: ['$setAt', new Date(year, month - 1, 1)] },
                  { $lt: ['$setAt', new Date(year, month, 1)] }
                ]
              }
            }
          },
        ],
        as: 'expense'
      }
    },
    { $group: { _id: '$_id', name: { $first: '$name' }, email: { $first: '$email' }, currentBalance: { $first: "$currentBalance"}, preferredCurrency: { $first: "$preferredCurrency" }, totalIncome: { $first: '$totalIncome' }, totalExpense: {$first: { $sum: '$expense.amount'} } } },

    // Get the user's budgets
    { $lookup: {
      from: 'budgets',
      let: { userId: '$_id' },
      as: 'budgets',
      pipeline: [
        { $match: {
            $expr: {
              $and: [{ $eq: ['$user', '$$userId'] }, { $eq: ['$active', true] }]
            }
        }}
      ],
    }}
  ]);
  res.status(200).json({
    status: "success",
    data: { user: user[0] },
  });
});

exports.updateAccount = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new CustomError("You cannot use this endpoint to update password.", 400),
    );
  }

  const newInfo = {
    name: req.body.name,
    email: req.body.email,
	currentBalance: req.body.currentBalance,
    preferredCurrency: req.body.preferredCurrency,
  };

  const updatedInfo = await User.findByIdAndUpdate(req.user.id, newInfo, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user: updatedInfo },
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
