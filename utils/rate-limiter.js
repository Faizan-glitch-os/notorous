const rateLimiter = require('express-rate-limit');
const AppError = require('./app-error');

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: (req, res, next, options) =>
    next(
      new AppError(
        'too many requests, please try again after 1 hour',
        'fail',
        options.statusCode,
      ),
    ),
});

module.exports = limiter;
