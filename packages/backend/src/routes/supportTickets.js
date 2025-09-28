const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createSupportTicket,
  getSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  addTicketReply,
  getSupportStats
} = require('../controllers/supportTicketController');

// All routes require authentication
router.use(authenticate);

// GET /support-tickets - Get tickets based on user role
router.get('/', authorize('STUDENT', 'TUTOR', 'ADMIN'), getSupportTickets);

// GET /support-tickets/stats - Get dashboard stats (Tutors and Admins)
router.get('/stats', authorize('TUTOR', 'ADMIN'), getSupportStats);

// GET /support-tickets/:id - Get specific ticket by ID
router.get('/:id', authorize('STUDENT', 'TUTOR', 'ADMIN'), getSupportTicketById);

// POST /support-tickets - Create new ticket (Students only)
router.post('/', authorize('STUDENT'), createSupportTicket);

// PUT /support-tickets/:id - Update ticket (Tutors and Admins)
router.put('/:id', authorize('TUTOR', 'ADMIN'), updateSupportTicket);

// POST /support-tickets/:id/replies - Add reply to ticket
router.post('/:id/replies', authorize('STUDENT', 'TUTOR', 'ADMIN'), addTicketReply);

module.exports = router;