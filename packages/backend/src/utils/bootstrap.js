const { User, Feature } = require('../models');
const { hashPassword, generateRandomPassword } = require('./auth');

const bootstrapAdmin = async () => {
  try {
    const adminCount = await User.count({
      where: { role: 'ADMIN' }
    });

    if (adminCount > 0) {
      console.log('✓ Admin user already exists');
      return;
    }

    const email = process.env.ADMIN_EMAIL || 'admin@lms.com';
    const password = process.env.ADMIN_PASSWORD || generateRandomPassword();
    const passwordHash = await hashPassword(password);

    const admin = await User.create({
      email,
      passwordHash,
      role: 'ADMIN'
    });

    console.log('\n========================================');
    console.log('🔐 ADMIN ACCOUNT CREATED');
    console.log('========================================');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('========================================');
    console.log('⚠️  Save this password securely! It will not be shown again.');
    console.log('========================================\n');

    return admin;
  } catch (error) {
    console.error('Error bootstrapping admin:', error.message);
    throw error;
  }
};

const bootstrapFeatures = async () => {
  try {
    const featureCount = await Feature.count();

    if (featureCount > 0) {
      console.log('✓ Features already exist');
      return;
    }

    const features = [
      {
        key: 'one_to_one',
        label: 'One-to-One Sessions',
        description: 'Access to personal tutoring sessions'
      },
      {
        key: 'smart_quad',
        label: 'Smart Quad',
        description: 'Access to small group learning sessions'
      },
      {
        key: 'masterclass',
        label: 'Masterclass',
        description: 'Access to expert workshop sessions'
      },
      {
        key: 'materials',
        label: 'Study Materials',
        description: 'Access to study materials and resources'
      },
      {
        key: 'progress_tracking',
        label: 'Progress Tracking',
        description: 'Access to progress tracking and analytics'
      },
      {
        key: 'calendar',
        label: 'Calendar',
        description: 'Access to calendar and scheduling features'
      }
    ];

    await Feature.bulkCreate(features);
    console.log('✓ Default features created');

  } catch (error) {
    console.error('Error bootstrapping features:', error.message);
    throw error;
  }
};

module.exports = { bootstrapAdmin, bootstrapFeatures };