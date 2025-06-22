const express = require('express');

const app = express();

const tourRouter = require('./routes/tour-router');
const userRouter = require('./routes/user-router');

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
