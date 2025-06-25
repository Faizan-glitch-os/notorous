const TourModel = require('../models/tour-model');
const ApiFeature = require('../utils');

exports.getTop5Tours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await TourModel.findById(req.params.id);

    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.addTour = async (req, res) => {
  try {
    const newTour = await TourModel.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await TourModel.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await TourModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        updatedTour,
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};
