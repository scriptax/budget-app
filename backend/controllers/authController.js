const crypto =  require("crypto");
const { promisify } = require('util');
const jwt = require("jsonwebtoken");

const User = require("./../models/userModel")
const catchAsync = require('./../utils/catchAsync');
const CustomError = require('../utils/customError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, req, res) => {
  // console.log(req)
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https"
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
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
    preferedCurrency: req.body.preferedCurrency,
  });
  // console.log(newUser);
  // const url = `${req.protocol}://${req.get("host")}/` for sending welcome message
  // console.log("sending response...")
  createAndSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  // checking if email and password are provided
  if(!email || !password) {
    return next(new CustomError("Please provide your email and password", 400));
  }

  // checking if user exists and getting their data 
  const user = await User.findOne({email}).select("+password");
  if(!user || !(await user.passwordCorrectness(password, user.password))) {
    return next(new CustomError("Incorrect email or password", 401));
  }

  // Everything ok... send token
  createAndSendToken(user, 200, req, res);
});