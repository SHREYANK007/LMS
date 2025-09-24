const asyncHandler = require('express-async-handler');
const { User } = require('../models');
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

module.exports = {
  createUser,
  resetPassword,
  getAllUsers,
  deleteUser
};