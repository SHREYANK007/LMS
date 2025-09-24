const { User } = require('../models');
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

module.exports = { bootstrapAdmin };