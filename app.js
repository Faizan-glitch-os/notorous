const fs = require('fs');

const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Tour Not Found, Invalid id' });
  }

  res.status(200).json({ status: 'success', data: { tour } });
};

const addTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Tour Not Found, Invalid id' });
  }

  res.status(200).json({ status: 'success', message: 'Tour updating...' });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Tour Not Found, Invalid id' });
  }

  res.status(204).json({ status: 'success', data: null });
};

const updateTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res
    .status(404)
    .json({ status: 'fail', message: 'Get All Users in progress' });
};
const getUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Get User in progress' });
};
const deleteUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Delete User in progress' });
};

app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', addTour);
app.delete('/api/v1/tours/:id', deleteTour);
app.post('/api/v1/tours', updateTour);

app.get('/api/v1/users', getAllUsers);
app.get('/api/v1/users/:id', getUser);
app.delete('/api/v1/users/:id', deleteUser);

const port = 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
