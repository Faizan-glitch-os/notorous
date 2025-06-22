const fs = require('fs');

const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) =>
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  })
);

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Tour Not Found, Invalid id' });
  }

  res.status(200).json({ status: 'success', data: { tour } });
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Tour Not Found, Invalid id' });
  }

  res.status(200).json({ status: 'success', message: 'Tour updating...' });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Tour Not Found, Invalid id' });
  }

  res.status(204).json({ status: 'success', data: null });
});

app.post('/api/v1/tours', (req, res) => {
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
});

const port = 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
