const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createSession,
  getTodaySessions,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession
} = require('../controllers/sessionController');

router.use(authenticate);

router.get('/today', authorize('STUDENT', 'TUTOR', 'ADMIN'), getTodaySessions);
router.get('/', authorize('STUDENT', 'TUTOR', 'ADMIN'), getAllSessions);
router.get('/:sessionId', authorize('STUDENT', 'TUTOR', 'ADMIN'), getSessionById);
router.post('/', authorize('TUTOR', 'ADMIN'), createSession);
router.put('/:sessionId', authorize('TUTOR', 'ADMIN'), updateSession);
router.delete('/:sessionId', authorize('TUTOR', 'ADMIN'), deleteSession);

module.exports = router;