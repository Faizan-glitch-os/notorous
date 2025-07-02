const userModel = require('../models/user-model');

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
