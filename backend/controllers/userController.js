const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const CustomError = require("./../utils/customError");

exports.updateAccount = catchAsync(async (req, res, next) => {
  if(req.body.password || req.body.passwordConfirm) {
    return next(new CustomError("You cannot use this endpoint to update password.", 400));
  }

  const newInfo = {
    name: req.body.name,
    email: req.body.email,
    preferredCurrency: req.body.preferredCurrency
  } 

  const updatedInfo = await User.findByIdAndUpdate(req.user.id, newInfo, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: {user: updatedInfo}
  });

});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: "success",
    data: null
  });
});
