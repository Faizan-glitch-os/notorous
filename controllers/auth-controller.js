const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const userModel = require('../models/user-model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/app-error');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await userModel.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;

  //check if email or password is available
  if (!email || !password) {
    if (!email) {
      return next(new AppError('please enter email', 'fail', 400));
    }
    if (!password) {
      return next(new AppError('please enter password', 'fail', 400));
    }
  }

  //check user in database
  const user = await userModel.findOne({ email }).select('+password');

  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError('Incorrect email or password', 'fail', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({ status: 'success', token });
});

exports.protect = catchAsync(async (req, res, next) => {
  let receivedToken;

  //check token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    receivedToken = req.headers.authorization.split(' ')[1];
  }

  if (!receivedToken) {
    return next(
      new AppError(
        'you are not logged in, please login to proceed',
        'fail',
        400,
      ),
    );
  }

  //decode token
  const decodedToken = await promisify(jwt.verify)(
    receivedToken,
    process.env.JWT_SECRET,
  );

  //check user in database
  const user = await userModel
    .findById(decodedToken.id)
    .select('+passwordChangedAt');
  if (!user) {
    return next(
      new AppError(
        'token belonging to this token no longer exist',
        'fail',
        401,
      ),
    );
  }

  //check if user have changed password after the token has issued
  if (user.checkChangePassword(decodedToken.iat)) {
    return next(
      new AppError(
        'user recently changed password, please login again',
        'fail',
        401,
      ),
    );
  }

  //access granted

  req.user = user;

  next();
});
