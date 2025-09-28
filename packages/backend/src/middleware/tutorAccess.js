const asyncHandler = require('express-async-handler');
const { TutorStudent, User, Session } = require('../models');

/**
 * Middleware to ensure tutors can only access their assigned students
 */
const checkTutorStudentAccess = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Only apply this check for tutors
  if (user.role !== 'TUTOR') {
    return next();
  }

  // Get student ID from various possible request parameters
  let studentId = req.body.studentId || req.params.studentId || req.query.studentId;

  // For session operations, check if students in the session are assigned to tutor
  if (req.body.students && Array.isArray(req.body.students)) {
    // Check all students in the request
    const studentIds = req.body.students;

    for (const id of studentIds) {
      const assignment = await TutorStudent.findOne({
        where: { tutor_id: user.id, student_id: id }
      });

      if (!assignment) {
        return res.status(403).json({
          error: 'Access denied. Student is not assigned to you.'
        });
      }
    }

    return next();
  }

  // If there's a student ID to check
  if (studentId) {
    const assignment = await TutorStudent.findOne({
      where: { tutor_id: user.id, student_id: studentId }
    });

    if (!assignment) {
      return res.status(403).json({
        error: 'Access denied. Student is not assigned to you.'
      });
    }
  }

  next();
});

/**
 * Middleware to ensure tutors can only access sessions they created or that involve their assigned students
 */
const checkTutorSessionAccess = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Only apply this check for tutors
  if (user.role !== 'TUTOR') {
    return next();
  }

  const sessionId = req.params.sessionId || req.params.id;

  if (sessionId) {
    const session = await Session.findByPk(sessionId, {
      include: [{
        model: User,
        as: 'students',
        attributes: ['id']
      }]
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    // Check if tutor created this session
    if (session.tutorId === user.id) {
      return next();
    }

    // If tutor didn't create it, check if any students in the session are assigned to them
    if (session.students && session.students.length > 0) {
      const studentIds = session.students.map(s => s.id);

      const assignedStudentCount = await TutorStudent.count({
        where: {
          tutor_id: user.id,
          student_id: studentIds
        }
      });

      if (assignedStudentCount > 0) {
        return next();
      }
    }

    return res.status(403).json({
      error: 'Access denied. You can only access sessions you created or sessions with your assigned students.'
    });
  }

  next();
});

/**
 * Filter sessions query for tutors to only return their sessions or sessions with their assigned students
 */
const filterTutorSessions = async (user, whereClause = {}) => {
  if (user.role !== 'TUTOR') {
    return whereClause;
  }

  // Get all assigned student IDs for this tutor
  const assignments = await TutorStudent.findAll({
    where: { tutor_id: user.id },
    attributes: ['student_id']
  });

  const assignedStudentIds = assignments.map(a => a.student_id);

  // Return sessions where tutor is the creator OR where assigned students are participants
  return {
    ...whereClause,
    $or: [
      { tutorId: user.id }, // Sessions created by tutor
      // Sessions with assigned students would need a different query structure
      // This will be handled in the controller level
    ]
  };
};

/**
 * Get list of student IDs assigned to a tutor
 */
const getTutorAssignedStudentIds = async (tutorId) => {
  const assignments = await TutorStudent.findAll({
    where: { tutor_id: tutorId },
    attributes: ['student_id']
  });

  return assignments.map(a => a.student_id);
};

module.exports = {
  checkTutorStudentAccess,
  checkTutorSessionAccess,
  filterTutorSessions,
  getTutorAssignedStudentIds
};