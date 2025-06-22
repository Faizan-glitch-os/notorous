const getAllUsers = (req, res) => {
  res
    .status(404)
    .json({ status: 'fail', message: 'Get All Users in progress' });
};
const getUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Get User in progress' });
};
const addUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Add User in progress' });
};
const updateUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Update User in progress' });
};
const deleteUser = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Delete User in progress' });
};

module.exports = { getAllUsers, getUser, addUser, updateUser, deleteUser };
