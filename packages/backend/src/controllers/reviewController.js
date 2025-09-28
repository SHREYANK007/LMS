const asyncHandler = require('express-async-handler');
const { Review, User, TutorStudent } = require('../models');
const { Op } = require('sequelize');

// Helper function to check if student is assigned to tutor
const checkStudentTutorAssignment = async (studentId, tutorId) => {
  const assignment = await TutorStudent.findOne({
    where: {
      student_id: studentId,
      tutor_id: tutorId
    }
  });
  return !!assignment;
};

// @desc    Create a review for assigned tutor
// @route   POST /reviews
// @access  Student only (for their assigned tutor)
const createReview = asyncHandler(async (req, res) => {
  const { tutor_id, rating, comment } = req.body;
  const student_id = req.user.id;

  // Block tutors from creating reviews
  if (req.user.role === 'TUTOR') {
    return res.status(403).json({
      success: false,
      error: 'Tutors are not allowed to create reviews'
    });
  }

  // Validate required fields
  if (!tutor_id || !rating) {
    return res.status(400).json({
      success: false,
      error: 'Tutor ID and rating are required'
    });
  }

  // Validate rating range
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return res.status(400).json({
      success: false,
      error: 'Rating must be an integer between 1 and 5'
    });
  }

  // Check if tutor exists and is actually a tutor
  const tutor = await User.findOne({
    where: { id: tutor_id, role: 'TUTOR' }
  });

  if (!tutor) {
    return res.status(404).json({
      success: false,
      error: 'Tutor not found'
    });
  }

  // For students: Check if they are assigned to this tutor
  if (req.user.role === 'STUDENT') {
    const isAssigned = await checkStudentTutorAssignment(student_id, tutor_id);
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        error: 'You can only review your assigned tutor'
      });
    }
  }

  // Check if review already exists
  const existingReview = await Review.findOne({
    where: { student_id, tutor_id }
  });

  if (existingReview) {
    return res.status(409).json({
      success: false,
      error: 'You have already reviewed this tutor'
    });
  }

  // Create the review
  const review = await Review.create({
    student_id,
    tutor_id,
    rating,
    comment: comment || null
  });

  // Get the created review with student info
  const createdReview = await Review.findByPk(review.id, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  res.status(201).json({
    success: true,
    review: createdReview
  });
});

// @desc    Get reviews for a tutor
// @route   GET /reviews/tutor/:tutorId
// @access  Student (for their assigned tutor), Admin (any tutor)
const getTutorReviews = asyncHandler(async (req, res) => {
  const { tutorId } = req.params;

  // Block tutors from viewing any reviews
  if (req.user.role === 'TUTOR') {
    return res.status(403).json({
      success: false,
      error: 'Tutors are not allowed to view reviews'
    });
  }

  // Check if tutor exists
  const tutor = await User.findOne({
    where: { id: tutorId, role: 'TUTOR' }
  });

  if (!tutor) {
    return res.status(404).json({
      success: false,
      error: 'Tutor not found'
    });
  }

  // For students: Check if they are assigned to this tutor
  if (req.user.role === 'STUDENT') {
    const isAssigned = await checkStudentTutorAssignment(req.user.id, tutorId);
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        error: 'You can only view reviews for your assigned tutor'
      });
    }
  }

  // Get reviews (only active ones for students, all for admin)
  const whereClause = { tutor_id: tutorId };
  if (req.user.role === 'STUDENT') {
    whereClause.is_active = true;
  }

  const reviews = await Review.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['created_at', 'DESC']]
  });

  // Calculate average rating from active reviews
  const activeReviews = reviews.filter(review => review.is_active);
  const averageRating = activeReviews.length > 0
    ? activeReviews.reduce((sum, review) => sum + review.rating, 0) / activeReviews.length
    : 0;

  res.json({
    success: true,
    reviews,
    stats: {
      totalReviews: activeReviews.length,
      averageRating: Math.round(averageRating * 10) / 10
    }
  });
});

// @desc    Update a review
// @route   PUT /reviews/:reviewId
// @access  Admin only
const updateReview = asyncHandler(async (req, res) => {
  // Only admin can update reviews
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Only administrators can update reviews'
    });
  }

  const { reviewId } = req.params;
  const { rating, comment, is_active } = req.body;

  const review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      error: 'Review not found'
    });
  }

  // Validate rating if provided
  if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
    return res.status(400).json({
      success: false,
      error: 'Rating must be an integer between 1 and 5'
    });
  }

  // Update fields
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  if (is_active !== undefined) review.is_active = is_active;

  await review.save();

  // Get updated review with student info
  const updatedReview = await Review.findByPk(reviewId, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  res.json({
    success: true,
    review: updatedReview
  });
});

// @desc    Delete a review
// @route   DELETE /reviews/:reviewId
// @access  Admin only
const deleteReview = asyncHandler(async (req, res) => {
  // Only admin can delete reviews
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Only administrators can delete reviews'
    });
  }

  const { reviewId } = req.params;

  const review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      error: 'Review not found'
    });
  }

  await review.destroy();

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// @desc    Get all reviews (admin only)
// @route   GET /reviews
// @access  Admin only
const getAllReviews = asyncHandler(async (req, res) => {
  // Only admin can view all reviews
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Only administrators can view all reviews'
    });
  }

  const reviews = await Review.findAll({
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      },
      {
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['created_at', 'DESC']]
  });

  res.json({
    success: true,
    reviews
  });
});

module.exports = {
  createReview,
  getTutorReviews,
  updateReview,
  deleteReview,
  getAllReviews
};