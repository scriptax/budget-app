const catchAsync = require("./../utils/catchAsync");
const CustomError = require("./../utils/customError");
const crudFactory = require("./../controllers/crudFactory");
const User = require("./../models/userModel");
const Budget = require("./../models/budgetModel");
const Expense = require("./../models/expenseModel");

exports.appendUserIds = (req, res, next) => {
  if(!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getBudget = crudFactory.getItem(Budget);
exports.createBudget = crudFactory.createItem(Budget);
exports.updateBudget = crudFactory.updateItem(Budget);
exports.deleteBudget = crudFactory.deleteItem(Budget);