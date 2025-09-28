const asyncHandler = require('express-async-handler');
const { User, Feature, StudentFeature, Session } = require('../models');
const { Op } = require('sequelize');
const { hashPassword, generateRandomPassword } = require('../utils/auth');

// Create a new student
const createStudent = asyncHandler(async (req, res) => {
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

  // Create student with role STUDENT
  const student = await User.create({
    name: name || null,
    email,
    passwordHash,
    role: 'STUDENT',
    courseType: courseType || null,
    phone: phone || null,
    dateOfBirth: dateOfBirth || null,
    emergencyContact: emergencyContact || null,
    isActive: true
  });

  // Add default features for new student (all disabled by default)
  const features = await Feature.findAll();
  for (const feature of features) {
    await StudentFeature.create({
      student_id: student.id,
      feature_id: feature.id,
      enabled: false // Start with features disabled
    });
  }

  // Fetch the student with features
  const studentWithFeatures = await User.findByPk(student.id, {
    include: [{
      model: Feature,
      as: 'features',
      through: {
        attributes: ['enabled']
      }
    }]
  });

  const studentData = studentWithFeatures.toJSON();
  const featuresObj = {};
  if (studentData.features) {
    studentData.features.forEach(feature => {
      featuresObj[feature.key] = {
        id: feature.id,
        label: feature.label,
        enabled: feature.StudentFeature.enabled
      };
    });
  }

  console.log(`Student created: ${email} by admin ${req.user.email}`);

  res.status(201).json({
    success: true,
    student: {
      id: studentData.id,
      name: studentData.name,
      email: studentData.email,
      courseType: studentData.courseType,
      phone: studentData.phone,
      dateOfBirth: studentData.dateOfBirth,
      emergencyContact: studentData.emergencyContact,
      isActive: studentData.isActive,
      createdAt: studentData.createdAt,
      features: featuresObj
    },
    credentials: {
      email: studentData.email,
      password: !password ? userPassword : undefined,
      generatedPassword: !password
    }
  });
});

// Update a student
const updateStudent = asyncHandler(async (req, res) => {
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

  const student = await User.findOne({
    where: {
      id,
      role: 'STUDENT'
    }
  });

  if (!student) {
    return res.status(404).json({
      error: 'Student not found'
    });
  }

  // If email is being changed, check for uniqueness
  if (email && email !== student.email) {
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

  // Update student fields
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (courseType !== undefined) updates.courseType = courseType;
  if (phone !== undefined) updates.phone = phone;
  if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
  if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact;
  if (isActive !== undefined) updates.isActive = isActive;

  await student.update(updates);

  // Fetch updated student with features
  const updatedStudent = await User.findByPk(id, {
    include: [{
      model: Feature,
      as: 'features',
      through: {
        attributes: ['enabled']
      }
    }]
  });

  const studentData = updatedStudent.toJSON();
  const features = {};
  if (studentData.features) {
    studentData.features.forEach(feature => {
      features[feature.key] = {
        id: feature.id,
        label: feature.label,
        enabled: feature.StudentFeature.enabled
      };
    });
  }

  res.json({
    success: true,
    student: {
      id: studentData.id,
      name: studentData.name,
      email: studentData.email,
      courseType: studentData.courseType,
      phone: studentData.phone,
      dateOfBirth: studentData.dateOfBirth,
      emergencyContact: studentData.emergencyContact,
      isActive: studentData.isActive,
      lastLogin: studentData.lastLogin,
      createdAt: studentData.createdAt,
      features
    }
  });
});

// Get all students with their features
const getAllStudents = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 20 } = req.query;

  const where = {
    role: 'STUDENT'
  };

  if (query) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query}%` } },
      { email: { [Op.iLike]: `%${query}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows: students } = await User.findAndCountAll({
    where,
    include: [
      {
        model: Feature,
        as: 'features',
        through: {
          attributes: ['enabled']
        }
      },
      {
        model: User,
        as: 'tutors',
        attributes: ['id', 'name', 'email', 'courseType', 'isActive'],
        through: {
          attributes: ['assignedAt']
        }
      }
    ],
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true
  });

  // Format the response
  const formattedStudents = students.map(student => {
    const studentData = student.toJSON();

    // Convert features to a more accessible format
    const features = {};
    if (studentData.features) {
      studentData.features.forEach(feature => {
        features[feature.key] = {
          id: feature.id,
          label: feature.label,
          enabled: feature.StudentFeature.enabled
        };
      });
    }

    return {
      id: studentData.id,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      courseType: studentData.courseType,
      isActive: studentData.isActive,
      lastLogin: studentData.lastLogin,
      createdAt: studentData.createdAt,
      features,
      tutors: studentData.tutors || []
    };
  });

  res.json({
    success: true,
    students: formattedStudents,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  });
});

// Get a single student with features
const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await User.findOne({
    where: {
      id,
      role: 'STUDENT'
    },
    include: [
      {
        model: Feature,
        as: 'features',
        through: {
          attributes: ['enabled']
        }
      }
    ]
  });

  if (!student) {
    return res.status(404).json({
      error: 'Student not found'
    });
  }

  const studentData = student.toJSON();

  // Convert features to a more accessible format
  const features = {};
  if (studentData.features) {
    studentData.features.forEach(feature => {
      features[feature.key] = {
        id: feature.id,
        label: feature.label,
        enabled: feature.StudentFeature.enabled
      };
    });
  }

  res.json({
    success: true,
    student: {
      id: studentData.id,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      courseType: studentData.courseType,
      dateOfBirth: studentData.dateOfBirth,
      emergencyContact: studentData.emergencyContact,
      isActive: studentData.isActive,
      lastLogin: studentData.lastLogin,
      createdAt: studentData.createdAt,
      features
    }
  });
});

// Toggle a feature for a student
const toggleStudentFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { featureKey, enabled } = req.body;

  // Validate inputs
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({
      error: 'enabled must be a boolean value'
    });
  }

  // Find the student
  const student = await User.findOne({
    where: {
      id,
      role: 'STUDENT'
    }
  });

  if (!student) {
    return res.status(404).json({
      error: 'Student not found'
    });
  }

  // Find the feature
  const feature = await Feature.findOne({
    where: { key: featureKey }
  });

  if (!feature) {
    return res.status(404).json({
      error: 'Feature not found'
    });
  }

  // Update or create the student-feature relationship
  const [studentFeature, created] = await StudentFeature.findOrCreate({
    where: {
      student_id: student.id,
      feature_id: feature.id
    },
    defaults: {
      enabled
    }
  });

  if (!created) {
    await studentFeature.update({ enabled });
  }

  res.json({
    success: true,
    message: `Feature ${featureKey} ${enabled ? 'enabled' : 'disabled'} for student`,
    feature: {
      key: featureKey,
      label: feature.label,
      enabled
    }
  });
});

// Delete a student
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await User.findOne({
    where: {
      id,
      role: 'STUDENT'
    }
  });

  if (!student) {
    return res.status(404).json({
      error: 'Student not found'
    });
  }

  // Check if student has any active sessions
  try {
    const activeSessions = await Session.count({
      where: {
        '$participants.id$': id,
        status: {
          [Op.in]: ['SCHEDULED', 'ONGOING']
        }
      },
      include: [{
        model: User,
        as: 'participants',
        attributes: []
      }]
    });

    if (activeSessions > 0) {
      return res.status(400).json({
        error: `Cannot delete student with ${activeSessions} active sessions. Please complete or cancel all sessions first.`
      });
    }
  } catch (sessionError) {
    console.error('Error checking sessions:', sessionError);
    // Continue with deletion if session check fails
  }

  // Delete the student (cascades will handle related records)
  await student.destroy();

  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
});

// Get all available features
const getAllFeatures = asyncHandler(async (req, res) => {
  const features = await Feature.findAll({
    order: [['label', 'ASC']]
  });

  res.json({
    success: true,
    features
  });
});

// Check if a student has access to a feature
const checkStudentFeatureAccess = asyncHandler(async (req, res) => {
  const { studentId, featureKey } = req.params;

  const studentFeature = await StudentFeature.findOne({
    where: {
      student_id: studentId,
      '$feature.key$': featureKey,
      enabled: true
    },
    include: [{
      model: Feature,
      as: 'feature',
      attributes: ['key']
    }]
  });

  res.json({
    success: true,
    hasAccess: !!studentFeature
  });
});

// Middleware to check feature access
const requireFeature = (featureKey) => {
  return asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'STUDENT') {
      // Non-students bypass feature checks
      return next();
    }

    const feature = await Feature.findOne({
      where: { key: featureKey }
    });

    if (!feature) {
      return res.status(500).json({
        error: 'Invalid feature configuration'
      });
    }

    const studentFeature = await StudentFeature.findOne({
      where: {
        student_id: req.user.id,
        feature_id: feature.id,
        enabled: true
      }
    });

    if (!studentFeature) {
      return res.status(403).json({
        error: `Access denied: ${feature.label} is not enabled for your account`
      });
    }

    next();
  });
};

module.exports = {
  createStudent,
  updateStudent,
  getAllStudents,
  getStudent,
  toggleStudentFeature,
  deleteStudent,
  getAllFeatures,
  checkStudentFeatureAccess,
  requireFeature
};