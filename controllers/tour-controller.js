const TourModel = require('../models/tour-model');
const ApiFeature = require('../utils/api-features');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catchAsync');

exports.getTop5Tours = catchAsync(async (req, res, next) => {
  const query = TourModel.find()
    .sort('-ratingAverage price')
    .select('name ratingAverage price summary description')
    .limit('5');

  const top5Tours = await query;

  res.status(200).json({
    status: 'success',
    results: top5Tours.length,
    data: { top5Tours },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const apiFeature = new ApiFeature(TourModel.find(), req.query)
    .filter()
    .sort()
    .fields()
    .limit();
  const tours = await apiFeature.model;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found based on this id', 'fail', 404));
  }

  res.status(200).json({ status: 'success', data: { tour } });
});

exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await TourModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found based on this id', 'fail', 404));
  }

  res.status(204).json({ status: 'success', data: null });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found based on this id', 'fail', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const tourStats = await TourModel.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$difficulty',
        toursSum: { $sum: 1 },
        numOfRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    results: tourStats.length,
    data: { tourStats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const monthlyPlan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numOfTours: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    results: monthlyPlan.length,
    data: { monthlyPlan },
  });
});
