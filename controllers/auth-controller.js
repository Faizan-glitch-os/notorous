const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/app-error');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await userModel.create(req.body);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({ status: 'success', token });
});
