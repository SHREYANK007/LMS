const asyncHandler = require('express-async-handler');
const { TutorStudent } = require('../models');

/**
 * Middleware to filter sessions based on user role and assignments
 * - Students see only sessions from their assigned tutors
 * - Tutors see only their own sessions (handled elsewhere)
 * - Admins see all sessions
 */
const filterSessionsForUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // For students, get their assigned tutors
  if (user.role === 'STUDENT') {
    const assignments = await TutorStudent.findAll({
      where: { student_id: user.id },
      attributes: ['tutor_id']
    });

    const assignedTutorIds = assignments.map(a => a.tutor_id);

    // Add the assigned tutor IDs to the request for use in controllers
    // Even if empty, the controller can still show masterclasses for the student's course type
    req.assignedTutorIds = assignedTutorIds;
  }

  next();
});

module.exports = {
  filterSessionsForUser
};