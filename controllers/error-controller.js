const AppError = require('../utils/app-error');

const handleCastErrorDb = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 'fail', 400);

const handleDuplicateErrorDb = (err) =>
  new AppError(
    `Duplicate field value "${err.keyValue.name}". Please enter another value`,
    err.status,
    err.statusCode,
  );

const handleValidationErrorDb = (err) =>
  new AppError(err.message, err.status, err.statusCode);

const errorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('Error occured', error);

    res.status(500).json({ status: 'Error', message: 'Something went wrong' });
  }
};

const errorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let err = { ...error };

    if (error.name === 'CastError') {
      err = handleCastErrorDb(error);
    }
    if (error.code === 11000) {
      err = handleDuplicateErrorDb(error);
    }
    if (error.name === 'ValidationError') {
      err = handleValidationErrorDb(error);
    }

    errorProd(err, res);
  } else if (process.env.NODE_ENV === 'development') {
    errorDev(error, res);
  }
};
