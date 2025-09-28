const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
  createTutor,
  updateTutor,
  getAllTutors,
  getTutor,
  deleteTutor
} = require('../controllers/tutorController');

// All routes require admin authentication
router.use(requireAuth, requireAdmin);

// Get all tutors
router.get('/', getAllTutors);

// Create a new tutor
router.post('/', createTutor);

// Get a single tutor
router.get('/:id', getTutor);

// Update a tutor
router.patch('/:id', updateTutor);

// Delete a tutor
router.delete('/:id', deleteTutor);

module.exports = router;