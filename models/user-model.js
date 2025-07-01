const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: { type: String, required: [true, 'User must have a name'], trim: true },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter correct email address'],
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    min: [8, 'Password must not be less than 8 characters'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please enter a password'],
  },
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
