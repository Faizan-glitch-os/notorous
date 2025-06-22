const express = require('express');

const app = express();

app.get('/', (req, res) =>
  res.status(200).json({ message: 'my first request' })
);

const port = 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
