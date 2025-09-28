const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createReview,
  getTutorReviews,
  updateReview,
  deleteReview,
  getAllReviews
} = require('../controllers/reviewController');

// Apply authentication middleware to all routes
router.use(authenticate);

// @route   POST /reviews
// @desc    Create a review for assigned tutor
// @access  Student only (for their assigned tutor)
router.post('/', createReview);

// @route   GET /reviews
// @desc    Get all reviews
// @access  Admin only
router.get('/', getAllReviews);

// @route   GET /reviews/tutor/:tutorId
// @desc    Get reviews for a specific tutor
// @access  Student (for their assigned tutor), Admin (any tutor)
router.get('/tutor/:tutorId', getTutorReviews);

// @route   PUT /reviews/:reviewId
// @desc    Update a review
// @access  Admin only
router.put('/:reviewId', updateReview);

// @route   DELETE /reviews/:reviewId
// @desc    Delete a review
// @access  Admin only
router.delete('/:reviewId', deleteReview);

module.exports = router;
