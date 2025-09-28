const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { User, Feature, TutorStudent } = require('../models');

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, dateOfBirth, courseType, emergencyContact } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (courseType !== undefined) user.courseType = courseType;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;

    await user.save();

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      courseType: user.courseType,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      emergencyContact: user.emergencyContact,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      googleCalendarConnected: user.googleCalendarConnected,
      averageRating: user.averageRating,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      error: 'Failed to update user profile'
    });
  }
});

// Get current user's profile with features
router.get('/me', authenticate, async (req, res) => {
  try {
    // Build query based on user role
    const query = {
      where: { id: req.user.id }
    };

    // If user is a student, include features
    if (req.user.role === 'STUDENT') {
      query.include = [{
        model: Feature,
        as: 'features',
        through: {
          attributes: ['enabled']
        }
      }];
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      courseType: user.courseType,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      emergencyContact: user.emergencyContact,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      googleCalendarConnected: user.googleCalendarConnected,
      averageRating: user.averageRating,
      createdAt: user.createdAt
    };

    // Add enabled features for students
    if (user.role === 'STUDENT' && user.features) {
      userData.enabledFeatures = user.features
        .filter(f => f.StudentFeature.enabled)
        .map(f => f.key);
    }

    // Add assigned tutors for students
    if (user.role === 'STUDENT') {
      const assignments = await TutorStudent.findAll({
        where: { student_id: user.id },
        include: [{
          model: User,
          as: 'tutor',
          attributes: ['id', 'name', 'email']
        }]
      });
      userData.assignedTutors = assignments.map(a => a.tutor);
    }

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile'
    });
  }
});

module.exports = router;