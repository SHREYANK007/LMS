const asyncHandler = require('express-async-handler');
const { TutorStudent } = require('../models');

/**
 * Middleware to ensure students can only access content from their assigned tutors
 */
const filterStudentContent = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Only apply this filtering for students
  if (user.role !== 'STUDENT') {
    return next();
  }

  // Get all tutors assigned to this student
  const assignments = await TutorStudent.findAll({
    where: { student_id: user.id },
    attributes: ['tutor_id']
  });

  const assignedTutorIds = assignments.map(a => a.tutor_id);

  // If student has no assigned tutors, they can't access any tutor content
  if (assignedTutorIds.length === 0) {
    return res.status(403).json({
      error: 'No tutors assigned to you. Please contact admin to assign a tutor.'
    });
  }

  // Add the assigned tutor IDs to the request for use in controllers
  req.assignedTutorIds = assignedTutorIds;

  next();
});

/**
 * Get list of tutor IDs assigned to a student
 */
const getStudentAssignedTutorIds = async (studentId) => {
  const assignments = await TutorStudent.findAll({
    where: { student_id: studentId },
    attributes: ['tutor_id']
  });

  return assignments.map(a => a.tutor_id);
};

module.exports = {
  filterStudentContent,
  getStudentAssignedTutorIds
};