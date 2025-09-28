const { User, Feature } = require('../models');

/**
 * Middleware to check if a student has access to a specific feature
 */
const checkStudentFeature = (featureKey) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated and is a student
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.user.role !== 'STUDENT') {
        // Non-students (admin, tutor) bypass feature checks
        return next();
      }

      // Fetch student with their enabled features
      const student = await User.findByPk(req.user.id, {
        include: [{
          model: Feature,
          as: 'features',
          where: { key: featureKey },
          through: {
            attributes: ['enabled'],
            where: { enabled: true }
          },
          required: false
        }]
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Check if the student has the feature enabled
      const hasFeature = student.features && student.features.length > 0;

      if (!hasFeature) {
        return res.status(403).json({
          error: 'Access denied',
          message: `You do not have access to the ${featureKey} feature`
        });
      }

      next();
    } catch (error) {
      console.error('Feature check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

/**
 * Get all enabled features for a student
 */
const getStudentFeatures = async (studentId) => {
  try {
    const student = await User.findByPk(studentId, {
      include: [{
        model: Feature,
        as: 'features',
        through: {
          attributes: ['enabled'],
          where: { enabled: true }
        }
      }]
    });

    if (!student) {
      return [];
    }

    return student.features.map(f => f.key);
  } catch (error) {
    console.error('Error fetching student features:', error);
    return [];
  }
};

module.exports = {
  checkStudentFeature,
  getStudentFeatures
};