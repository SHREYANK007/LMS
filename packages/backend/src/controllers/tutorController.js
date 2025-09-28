const asyncHandler = require('express-async-handler');
const { User, Session, TutorStudent } = require('../models');
const { Op } = require('sequelize');
const { hashPassword, generateRandomPassword } = require('../utils/auth');

// Create a new tutor
const createTutor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    courseType,
    phone,
    dateOfBirth,
    emergencyContact
  } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    where: { email }
  });

  if (existingUser) {
    return res.status(409).json({
      error: 'User with this email already exists'
    });
  }

  // Generate password if not provided
  const userPassword = password || generateRandomPassword();
  const passwordHash = await hashPassword(userPassword);

  // Create tutor with role TUTOR
  const tutor = await User.create({
    name: name || null,
    email,
    passwordHash,
    role: 'TUTOR',
    courseType: courseType || null,
    phone: phone || null,
    dateOfBirth: dateOfBirth || null,
    emergencyContact: emergencyContact || null,
    isActive: true
  });

  console.log(`Tutor created: ${email} by admin ${req.user.email}`);

  res.status(201).json({
    success: true,
    tutor: {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      courseType: tutor.courseType,
      phone: tutor.phone,
      dateOfBirth: tutor.dateOfBirth,
      emergencyContact: tutor.emergencyContact,
      isActive: tutor.isActive,
      createdAt: tutor.createdAt
    },
    credentials: {
      email: tutor.email,
      password: !password ? userPassword : undefined,
      generatedPassword: !password
    }
  });
});

// Update a tutor
const updateTutor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    courseType,
    phone,
    dateOfBirth,
    emergencyContact,
    isActive
  } = req.body;

  const tutor = await User.findOne({
    where: {
      id,
      role: 'TUTOR'
    }
  });

  if (!tutor) {
    return res.status(404).json({
      error: 'Tutor not found'
    });
  }

  // If email is being changed, check for uniqueness
  if (email && email !== tutor.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    const existingUser = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: id }
      }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Email already in use'
      });
    }
  }

  // Update tutor fields
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (courseType !== undefined) updates.courseType = courseType;
  if (phone !== undefined) updates.phone = phone;
  if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
  if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact;
  if (isActive !== undefined) updates.isActive = isActive;

  await tutor.update(updates);

  res.json({
    success: true,
    tutor: {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      courseType: tutor.courseType,
      phone: tutor.phone,
      dateOfBirth: tutor.dateOfBirth,
      emergencyContact: tutor.emergencyContact,
      isActive: tutor.isActive,
      lastLogin: tutor.lastLogin,
      createdAt: tutor.createdAt
    }
  });
});

// Get all tutors
const getAllTutors = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 20 } = req.query;

  const where = {
    role: 'TUTOR'
  };

  if (query) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query}%` } },
      { email: { [Op.iLike]: `%${query}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows: tutors } = await User.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
    attributes: [
      'id',
      'name',
      'email',
      'phone',
      'courseType',
      'dateOfBirth',
      'emergencyContact',
      'isActive',
      'lastLogin',
      'createdAt',
      'updatedAt',
      'averageRating'
    ],
    include: [{
      model: User,
      as: 'students',
      attributes: ['id', 'name', 'email', 'courseType', 'isActive'],
      through: {
        attributes: ['assignedAt']
      }
    }]
  });

  // Get session stats for each tutor
  const tutorsWithStats = await Promise.all(tutors.map(async (tutor) => {
    const tutorData = tutor.toJSON();

    // Get session statistics
    const totalSessions = await Session.count({
      where: { tutorId: tutor.id }
    });

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const sessionsThisWeek = await Session.count({
      where: {
        tutorId: tutor.id,
        createdAt: { [Op.gte]: thisWeekStart }
      }
    });

    // Get actual student count for this tutor
    const totalStudents = await TutorStudent.count({
      where: { tutor_id: tutor.id }
    });

    // Use the averageRating field from the database, or default to 0
    const averageRating = tutor.averageRating || 0;

    return {
      ...tutorData,
      stats: {
        totalSessions,
        sessionsThisWeek,
        totalStudents,
        averageRating: averageRating.toFixed(1)
      }
    };
  }));

  res.json({
    success: true,
    tutors: tutorsWithStats,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  });
});

// Get a single tutor
const getTutor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tutor = await User.findOne({
    where: {
      id,
      role: 'TUTOR'
    }
  });

  if (!tutor) {
    return res.status(404).json({
      error: 'Tutor not found'
    });
  }

  // Get session statistics
  const totalSessions = await Session.count({
    where: { tutorId: tutor.id }
  });

  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const sessionsThisWeek = await Session.count({
    where: {
      tutorId: tutor.id,
      createdAt: { [Op.gte]: thisWeekStart }
    }
  });

  // Get actual student count for this tutor
  const totalStudents = await TutorStudent.count({
    where: { tutor_id: tutor.id }
  });

  // Use the averageRating field from the database, or default to 0
  const averageRating = tutor.averageRating || 0;

  res.json({
    success: true,
    tutor: {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      courseType: tutor.courseType,
      dateOfBirth: tutor.dateOfBirth,
      emergencyContact: tutor.emergencyContact,
      isActive: tutor.isActive,
      lastLogin: tutor.lastLogin,
      createdAt: tutor.createdAt,
      stats: {
        totalSessions,
        sessionsThisWeek,
        totalStudents,
        averageRating: averageRating.toFixed(1)
      }
    }
  });
});

// Delete a tutor
const deleteTutor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tutor = await User.findOne({
    where: {
      id,
      role: 'TUTOR'
    }
  });

  if (!tutor) {
    return res.status(404).json({
      error: 'Tutor not found'
    });
  }

  // Check if tutor has any active sessions
  try {
    const activeSessions = await Session.count({
      where: {
        tutorId: id,
        status: {
          [Op.in]: ['SCHEDULED', 'ONGOING']
        }
      }
    });

    if (activeSessions > 0) {
      return res.status(400).json({
        error: `Cannot delete tutor with ${activeSessions} active sessions. Please complete or cancel all sessions first.`
      });
    }
  } catch (sessionError) {
    console.error('Error checking sessions:', sessionError);
    // Continue with deletion if session check fails
  }

  // Delete the tutor (cascades will handle related records)
  await tutor.destroy();

  res.json({
    success: true,
    message: 'Tutor deleted successfully'
  });
});

// Get students assigned to the current tutor (for tutor's own use)
const getTutorAssignedStudents = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;

  const tutor = await User.findOne({
    where: { id: tutorId, role: 'TUTOR' },
    include: [{
      model: User,
      as: 'students',
      attributes: ['id', 'name', 'email', 'courseType', 'phone', 'isActive'],
      through: {
        attributes: ['assignedAt']
      },
      where: {
        isActive: true
      },
      required: false
    }]
  });

  if (!tutor) {
    return res.status(404).json({
      error: 'Tutor not found'
    });
  }

  res.json({
    success: true,
    students: tutor.students || []
  });
});

module.exports = {
  createTutor,
  updateTutor,
  getAllTutors,
  getTutor,
  deleteTutor,
  getTutorAssignedStudents
};