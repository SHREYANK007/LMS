const asyncHandler = require('express-async-handler');
const { User, TutorStudent } = require('../models');
const { hashPassword, generateRandomPassword } = require('../utils/auth');

const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    courseType,
    phone,
    dateOfBirth,
    emergencyContact
  } = req.body;

  // Validation
  if (!email || !role) {
    return res.status(400).json({
      error: 'Email and role are required'
    });
  }

  if (!['TUTOR', 'STUDENT'].includes(role)) {
    return res.status(400).json({
      error: 'Role must be either TUTOR or STUDENT'
    });
  }

  // Validate course type for students and tutors
  const validCourseTypes = ['PTE', 'IELTS', 'TOEFL', 'GENERAL_ENGLISH', 'BUSINESS_ENGLISH', 'ACADEMIC_WRITING'];
  if (courseType && !validCourseTypes.includes(courseType)) {
    return res.status(400).json({
      error: 'Invalid course type. Must be one of: ' + validCourseTypes.join(', ')
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

  // Create user with all details
  const user = await User.create({
    name: name || null,
    email,
    passwordHash,
    role,
    courseType: courseType || null,
    phone: phone || null,
    dateOfBirth: dateOfBirth || null,
    emergencyContact: emergencyContact || null,
    isActive: true
  });

  console.log(`User created: ${email} (${role}) by admin ${req.user.email}`);

  res.status(201).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      courseType: user.courseType,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      emergencyContact: user.emergencyContact,
      isActive: user.isActive,
      createdAt: user.createdAt
    },
    credentials: {
      email: user.email,
      password: !password ? userPassword : undefined, // Only return generated passwords
      generatedPassword: !password // Flag to indicate if password was generated
    }
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  const newPassword = password || generateRandomPassword();
  const passwordHash = await hashPassword(newPassword);

  await user.update({ passwordHash });

  res.json({
    success: true,
    message: 'Password reset successfully',
    generatedPassword: !password ? newPassword : undefined
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;

  const where = {};
  if (role && ['ADMIN', 'TUTOR', 'STUDENT'].includes(role)) {
    where.role = role;
  }

  const users = await User.findAll({
    where,
    attributes: [
      'id',
      'name',
      'email',
      'role',
      'courseType',
      'phone',
      'dateOfBirth',
      'emergencyContact',
      'isActive',
      'lastLogin',
      'createdAt',
      'updatedAt'
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    users
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  if (user.role === 'ADMIN') {
    const adminCount = await User.count({
      where: { role: 'ADMIN' }
    });

    if (adminCount <= 1) {
      return res.status(400).json({
        error: 'Cannot delete the last admin user'
      });
    }
  }

  await user.destroy();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  // Validate isActive parameter
  if (typeof isActive !== 'boolean') {
    return res.status(400).json({
      error: 'isActive must be a boolean value'
    });
  }

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  // Prevent deactivating admin accounts
  if (user.role === 'ADMIN' && !isActive) {
    const activeAdminCount = await User.count({
      where: {
        role: 'ADMIN',
        isActive: true
      }
    });

    if (activeAdminCount <= 1) {
      return res.status(400).json({
        error: 'Cannot deactivate the last active admin user'
      });
    }
  }

  await user.update({ isActive });

  console.log(`User ${user.email} account status changed to ${isActive ? 'active' : 'inactive'} by admin ${req.user.email}`);

  res.json({
    success: true,
    message: `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
    user: {
      id: user.id,
      email: user.email,
      isActive: user.isActive
    }
  });
});

// Assign a student to a tutor
const assignStudentToTutor = asyncHandler(async (req, res) => {
  const { tutorId, studentId } = req.body;

  if (!tutorId || !studentId) {
    return res.status(400).json({
      error: 'Both tutorId and studentId are required'
    });
  }

  // Verify tutor exists and has TUTOR role
  const tutor = await User.findOne({
    where: { id: tutorId, role: 'TUTOR', isActive: true }
  });

  if (!tutor) {
    return res.status(404).json({
      error: 'Active tutor not found'
    });
  }

  // Verify student exists and has STUDENT role
  const student = await User.findOne({
    where: { id: studentId, role: 'STUDENT', isActive: true }
  });

  if (!student) {
    return res.status(404).json({
      error: 'Active student not found'
    });
  }

  // Check if assignment already exists
  const existingAssignment = await TutorStudent.findOne({
    where: { tutor_id: tutorId, student_id: studentId }
  });

  if (existingAssignment) {
    return res.status(409).json({
      error: 'Student is already assigned to this tutor'
    });
  }

  // Create the assignment
  const assignment = await TutorStudent.create({
    tutor_id: tutorId,
    student_id: studentId
  });

  console.log(`Student ${student.email} assigned to tutor ${tutor.email} by admin ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Student assigned to tutor successfully',
    assignment: {
      id: assignment.id,
      tutorId,
      studentId,
      assignedAt: assignment.assignedAt
    }
  });
});

// Remove a student from a tutor
const removeStudentFromTutor = asyncHandler(async (req, res) => {
  const { tutorId, studentId } = req.params;

  const assignment = await TutorStudent.findOne({
    where: { tutor_id: tutorId, student_id: studentId },
    include: [
      { model: User, as: 'tutor', attributes: ['email', 'name'] },
      { model: User, as: 'student', attributes: ['email', 'name'] }
    ]
  });

  if (!assignment) {
    return res.status(404).json({
      error: 'Assignment not found'
    });
  }

  await assignment.destroy();

  console.log(`Student ${assignment.student.email} removed from tutor ${assignment.tutor.email} by admin ${req.user.email}`);

  res.json({
    success: true,
    message: 'Student removed from tutor successfully'
  });
});

// Get all students assigned to a tutor
const getTutorAssignments = asyncHandler(async (req, res) => {
  const { tutorId } = req.params;

  const tutor = await User.findOne({
    where: { id: tutorId, role: 'TUTOR' },
    include: [{
      model: User,
      as: 'students',
      attributes: ['id', 'name', 'email', 'courseType', 'isActive'],
      through: {
        attributes: ['assignedAt']
      }
    }]
  });

  if (!tutor) {
    return res.status(404).json({
      error: 'Tutor not found'
    });
  }

  res.json({
    success: true,
    tutor: {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email
    },
    students: tutor.students
  });
});

// Get all tutors assigned to a student
const getStudentAssignments = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await User.findOne({
    where: { id: studentId, role: 'STUDENT' },
    include: [{
      model: User,
      as: 'tutors',
      attributes: ['id', 'name', 'email', 'courseType', 'isActive'],
      through: {
        attributes: ['assignedAt']
      }
    }]
  });

  if (!student) {
    return res.status(404).json({
      error: 'Student not found'
    });
  }

  res.json({
    success: true,
    student: {
      id: student.id,
      name: student.name,
      email: student.email
    },
    tutors: student.tutors
  });
});

// Generate account details text file
const generateAccountDetailsFile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId, {
    attributes: [
      'id',
      'name',
      'email',
      'role',
      'courseType',
      'phone',
      'dateOfBirth',
      'emergencyContact',
      'isActive',
      'createdAt'
    ]
  });

  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  // Get password from request body (if resetting) or from session/context
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: 'Password is required to generate account details file'
    });
  }

  // Generate text content
  const accountDetails = `
==============================================
ACCOUNT DETAILS - ${user.role.toUpperCase()}
==============================================

PERSONAL INFORMATION:
• Full Name: ${user.name || 'Not provided'}
• Email Address: ${user.email}
• Role: ${user.role}
• Course Type: ${user.courseType || 'Not specified'}
• Phone: ${user.phone || 'Not provided'}
• Date of Birth: ${user.dateOfBirth || 'Not provided'}
• Emergency Contact: ${user.emergencyContact || 'Not provided'}

LOGIN CREDENTIALS:
• Username/Email: ${user.email}
• Password: ${password}

ACCOUNT STATUS:
• Status: ${user.isActive ? 'Active' : 'Inactive'}
• Created: ${new Date(user.createdAt).toLocaleString()}
• Account ID: ${user.id}

IMPORTANT NOTES:
• Please keep this information secure and confidential
• Change your password after first login
• Contact admin if you have any issues accessing your account
• This file contains sensitive information - delete after use

==============================================
Generated on: ${new Date().toLocaleString()}
Generated by: Admin (${req.user.email})
==============================================
`.trim();

  // Set headers for file download
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="account_details_${user.email.replace('@', '_at_')}_${Date.now()}.txt"`);

  res.send(accountDetails);
});

module.exports = {
  createUser,
  resetPassword,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  assignStudentToTutor,
  removeStudentFromTutor,
  getTutorAssignments,
  getStudentAssignments,
  generateAccountDetailsFile
};