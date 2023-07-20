const catchAsync = require("./../utils/catchAsync");
const customError = require("./../utils/customError");
const User = require("./../models/userModel")

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: "success",
    data: null
  });
});
