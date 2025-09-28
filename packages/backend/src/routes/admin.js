const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createUser,
  resetPassword,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  assignStudentToTutor,
  removeStudentFromTutor,
  getTutorAssignments,
  getStudentAssignments,
  generateAccountDetailsFile
} = require('../controllers/adminController');

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/users', getAllUsers);
router.post('/create-user', createUser);
router.post('/reset-password/:userId', resetPassword);
router.post('/users/:userId/account-details', generateAccountDetailsFile);
router.patch('/users/:userId/status', toggleUserStatus);
router.delete('/users/:userId', deleteUser);

// Tutor-Student Assignment routes
router.post('/assignments', assignStudentToTutor);
router.delete('/assignments/:tutorId/:studentId', removeStudentFromTutor);
router.get('/tutors/:tutorId/assignments', getTutorAssignments);
router.get('/students/:studentId/assignments', getStudentAssignments);

module.exports = router;