const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('query parser', 'extended');

const tourRouter = require('./routes/tour-router');
const userRouter = require('./routes/user-router');

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*splat', (req, res, next) => {
  next(
    new AppError(
      `Can't find the url ${req.originalUrl} at this server`,
      'fail',
      404,
    ),
  );
});

app.use(globalErrorHandler);

module.exports = app;
