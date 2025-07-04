const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    min: [8, 'Password must not be less than 8 characters'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm the password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same',
    },
  },
  passwordChangedAt: { type: Date, select: false },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now();

  this.confirmPassword = undefined;

  next();
});

userSchema.methods.comparePasswords = async (receivedPass, actualPass) =>
  await bcrypt.compare(receivedPass, actualPass);

userSchema.methods.checkChangePassword = function (tokenIssuedAt) {
  const passwordChangedAt = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10,
  );

  return passwordChangedAt > tokenIssuedAt;
};

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
