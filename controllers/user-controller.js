exports.getAllUsers = (req, res) => {
  res
    .status(404)
    .json({ status: 'fail', message: 'Get All Users in progress' });
};
exports.getUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Get User in progress' });
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
