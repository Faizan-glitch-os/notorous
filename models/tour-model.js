const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  price: { type: Number, required: [true, 'A tour must have a price'] },
  priceDiscount: {
    type: Number,
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a summary'],
    trim: true,
  },
  description: { type: String, trim: true },
  duration: { type: String, required: [true, 'A tour must have durations'] },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have max group size'],
  },
  ratingAverage: { type: Number, default: 4.3 },
  ratingQuantity: { type: Number, default: 0 },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: { type: [String] },
  createdAt: { type: Date, default: Date.now() },
  startDates: { type: [Date] },
});

const TourModel = mongoose.model('tours', tourSchema);

module.exports = TourModel;
