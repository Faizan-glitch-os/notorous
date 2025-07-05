const jwt = require('jsonwebtoken');
const validator = require('validator');
const { promisify } = require('util');
const userModel = require('../models/user-model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/app-error');
const sendEmail = require('../utils/nodemailer');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  let newUser = await userModel.create(req.body);

  const token = signToken(newUser._id);

  newUser = newUser.toObject();
  delete newUser.passwordChangedAt;

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
      return next(new AppError('please enter email', 'fail', 404));
    }
    if (!password) {
      return next(new AppError('please enter password', 'fail', 404));
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

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "you don't have permission to perform this action",
          'fail',
          403,
        ),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //check if email is provided
  if (!req.body && !req.body.email) {
    return next(new AppError('please enter an email', 'fail', 400));
  }

  //check if email is valid
  if (!validator.isEmail(req.body.email)) {
    return next(
      new AppError('invalid email, please enter a valid email', 'fail', 400),
    );
  }

  //check if user available in database
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('email you provided doesnot exist', 'fail', 404));
  }

  //generate token
  const resetToken = await user.createResetToken();
  await user.save({ validateBeforeSave: false });

  //send email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const options = {
    from: 'Faizan Ahmad <api developer>',
    to: user.email,
    subject: 'your password reset token, valid for 10mins',
    text: `looks like you have forgotten your password. Click on the following link to reset your password \n ${resetURL}`,
  };

  try {
    await sendEmail(options);
    res.status(200).json({
      status: 'success',
      message: 'token send to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.resetTokenTime = undefined;
    user.save({ validateBeforeSave: false });

    return next(
      new AppError('Error sending email, please try again later', 'fail', 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
