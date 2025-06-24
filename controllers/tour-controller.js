const TourModel = require('../models/tour-model');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await TourModel.find();
    res.status(200).json({
      status: 'success',
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
    const id = req.params.id * 1;
    const tour = await TourModel.findById(id);
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.addTour = async (req, res) => {};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};

exports.updateTour = (req, res) => {
  res.status(201).json({ status: 'success' });
};
