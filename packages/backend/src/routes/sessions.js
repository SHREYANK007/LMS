const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { checkTutorStudentAccess, checkTutorSessionAccess } = require('../middleware/tutorAccess');
const { filterSessionsForUser } = require('../middleware/sessionAccess');
const {
  createSession,
  getTodaySessions,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  createMasterclass
} = require('../controllers/sessionController');

router.use(authenticate);

router.get('/today', authorize('STUDENT', 'TUTOR', 'ADMIN'), filterSessionsForUser, getTodaySessions);
router.get('/', authorize('STUDENT', 'TUTOR', 'ADMIN'), filterSessionsForUser, getAllSessions);
router.get('/:sessionId', authorize('STUDENT', 'TUTOR', 'ADMIN'), checkTutorSessionAccess, getSessionById);
router.post('/', authorize('TUTOR', 'ADMIN'), checkTutorStudentAccess, createSession);
router.post('/masterclass', authorize('ADMIN'), createMasterclass);
router.put('/:sessionId', authorize('TUTOR', 'ADMIN'), checkTutorSessionAccess, updateSession);
router.delete('/:sessionId', authorize('TUTOR', 'ADMIN'), checkTutorSessionAccess, deleteSession);

module.exports = router;