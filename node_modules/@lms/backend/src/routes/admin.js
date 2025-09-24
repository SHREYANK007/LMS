const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createUser,
  resetPassword,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/users', getAllUsers);
router.post('/create-user', createUser);
router.post('/reset-password/:userId', resetPassword);
router.delete('/users/:userId', deleteUser);

module.exports = router;