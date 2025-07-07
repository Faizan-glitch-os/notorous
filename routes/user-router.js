const express = require('express');

const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');
const limiter = require('../utils/rate-limiter');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', limiter, authController.signin);

router.post('/forgotPassword', authController.forgotPassword);
router.patch(
  '/resetPassword/:passwordResetToken',
  authController.resetPassword,
);
router.patch(
  '/changePassword',
  authController.protect,
  authController.changePassword,
);

router.patch(
  '/updateProfile',
  authController.protect,
  userController.updateProfile,
);

router.delete(
  '/deleteProfile',
  authController.protect,
  userController.deleteProfile,
);

router.route('/').get(userController.getAllUsers).post(userController.addUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    userController.deleteUser,
  );

module.exports = router;
