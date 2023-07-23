const catchAsync = require("./../utils/catchAsync");
const CustomError = require("./../utils/customError");

const Budget = require("./../models/budgetModel");

exports.appendUserIds = (req, res, next) => {
  if(!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getBudget = catchAsync(async(req, res, next) => {
  let budget = await Budget.findById(req.params.id);

  if(!budget) {
    return next(new CustomError("No item found with this id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: budget
    }
  });
});

exports.createBudget = catchAsync(async(req, res, next) => {
  const budget = await Budget.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      budget
    }
  });
});

exports.updateBudget = catchAsync(async(req, res, next) => {
  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if(!budget) {
    return next(new CustomError("No item found with this id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: budget
    }
  });
});

exports.deleteBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.findByIdAndDelete(req.params.id);

  if(!budget) {
    return next(new CustomError("No item found with this id.", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});;