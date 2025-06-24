const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
});

const TourModel = mongoose.model('tours', tourSchema);

module.exports = TourModel;
