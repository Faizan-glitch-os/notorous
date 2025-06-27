const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'name must not exceede 20 characters'],
      minlength: [5, 'name must have more than 5 characters'],
    },
    slug: String,
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discout({VALUE}) must be lower than the original price',
      },
    },
    secretTour: { type: Boolean, default: false },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must only be easy, medium or difficult',
      },
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
    ratingsAverage: { type: Number, default: 4.3 },
    ratingsQuantity: { type: Number, default: 0 },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: { type: [String] },
    createdAt: { type: Date, default: Date.now() },
    startDates: { type: [Date] },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const TourModel = mongoose.model('tours', tourSchema);

module.exports = TourModel;
