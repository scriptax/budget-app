const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const CustomError = require("../utils/customError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, req, res) => {
  // console.log(req)
  const token = signToken(user._id);
  const isLocalhost = req.hostname === '127.0.0.1';
  console.log(req.hostname)
  const secure = isLocalhost ? true : req.secure || req.headers['x-forwarded-proto'] === 'https';
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: "None",
    secure: secure,
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // console.log("endpoint hit!")
  // console.log(req.body)
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    currentBalance: req.body.currentBalance,
    preferredCurrency: req.body.preferredCurrency,
  });
  // console.log(newUser);
  // const url = `${req.protocol}://${req.get("host")}/` for sending welcome message
  // console.log("sending response...")
  createAndSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if email and password are provided
  if (!email || !password) {
    return next(new CustomError("Please provide your email and password", 400));
  }

  // checking if user existance and checking password
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.passwordCorrectness(password, user.password))) {
    return next(new CustomError("Incorrect email or password", 401));
  }

  // Everything ok... send token
  createAndSendToken(user, 200, req, res);
});

exports.logout = (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    return next(
      new CustomError("You must be logged in to perform that action!", 401),
    );
  }

  // decode the token to userid it was issued for
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  // check if user exist in the DB
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(
      new CustomError("The user the token was issued for does not exist.", 401),
    );
  }

  // check if password has not changed after token was issued
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new CustomError(
        "Password has been changed recently. Please log in again.",
        401,
      ),
    );
  }

  // Everything checked. Grant access...
  req.user = currentUser;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // check if the given current password is correct
  if (
    !(await user.passwordCorrectness(req.body.currentPassword, user.password))
  ) {
    return next(new CustomError("Current password is not correct", 401));
  }

  // Good to go... update password and send a token
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createAndSendToken(user, 200, req, res);
});
