const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { requireFeature } = require('../controllers/studentController');
const { filterStudentContent } = require('../middleware/studentAccess');
const {
  createSmartQuadSession,
  getTutorSmartQuadSessions,
  getAvailableSmartQuadSessions,
  updateSmartQuadSession,
  deleteSmartQuadSession
} = require('../controllers/smartQuadController');

// All routes require authentication
router.use(authenticate);

// Routes for tutors to manage Smart Quad sessions
router.post('/create', authorize('TUTOR'), createSmartQuadSession);
router.get('/tutor/sessions', authorize('TUTOR'), getTutorSmartQuadSessions);
router.put('/:sessionId', authorize('TUTOR'), updateSmartQuadSession);
router.delete('/:sessionId', authorize('TUTOR'), deleteSmartQuadSession);

// Routes for students to view available Smart Quad sessions
router.get('/available', authorize('STUDENT'), requireFeature('smart_quad'), filterStudentContent, getAvailableSmartQuadSessions);

// Routes for admins to view all Smart Quad sessions
router.get('/all', authorize('ADMIN'), async (req, res) => {
  try {
    const { Session, User } = require('../models');

    const sessions = await Session.findAll({
      where: { sessionType: 'SMART_QUAD' },
      include: [{
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email']
      }],
      order: [['startTime', 'DESC']]
    });

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description,
        startTime: session.startTime,
        endTime: session.endTime,
        sessionType: session.sessionType,
        courseType: session.courseType,
        maxParticipants: session.maxParticipants,
        currentParticipants: session.currentParticipants,
        meetLink: session.meetLink,
        calendarEventUrl: session.calendarEventUrl,
        status: session.status,
        tutor: session.tutor,
        createdAt: session.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching all Smart Quad sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch sessions'
    });
  }
});

module.exports = router;