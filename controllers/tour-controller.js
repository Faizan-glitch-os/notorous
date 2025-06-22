const fs = require('fs');

exports.checkId = (req, res, next, val) => {
  const id = req.params.id * 1;
  console.log(`Tour id: ${val}`);

  if (id > tours.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Tour Not Found, Invalid id' });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.difficulty) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Name and Difficulty is required' });
  }

  next();
};

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({ status: 'success', data: { tour } });
};

exports.addTour = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Tour updating...' });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};

exports.updateTour = (req, res) => {
  const receivedData = req.body;
  const id = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: id }, receivedData);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => console.log('Error occured while saving the file')
  );

  res.status(201).json({ status: 'success', data: { tour: newTour } });
};
