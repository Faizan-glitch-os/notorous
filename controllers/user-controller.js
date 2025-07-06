const userModel = require('../models/user-model');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catchAsync');

const filterFields = (body, ...allowed) => {
  const filtered = {};
  Object.keys(body).forEach((el) => {
    if (allowed.includes(el)) {
      filtered[el] = body[el];
    }
  });
  return filtered;
};

exports.getAllUsers = async (req, res) => {
  res
    .status(404)
    .json({ status: 'fail', message: 'Get All Users in progress' });
};
exports.getUser = async (req, res) => {
  const user = await userModel.findById(req.params.id);

  res.status(404).json({ status: 'fail', data: { user } });
};
exports.addUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Add User in progress' });
};
exports.updateUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Update User in progress' });
};
exports.deleteUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Delete User in progress' });
};

exports.updateProfile = catchAsync(async (req, res, next) => {
  //check if request doesnot contains any passwords
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('this route is not for changing passwords', 'fail', 404),
    );
  }

  //filter body for unwanted fields
  const filteredFields = filterFields(req.body, 'name', 'email');

  //find user in database and update fields
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    filteredFields,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
