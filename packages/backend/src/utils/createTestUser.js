const { User } = require('../models');
const { hashPassword } = require('./auth');

async function createTestUser() {
  try {
    // Create test admin user
    const passwordHash = await hashPassword('admin123');

    const adminUser = await User.create({
      email: 'admin@test.com',
      passwordHash,
      role: 'ADMIN',
      name: 'Test Admin'
    });

    console.log('✓ Test admin user created:', {
      email: 'admin@test.com',
      password: 'admin123',
      role: 'ADMIN'
    });

    // Create test student user
    const studentPasswordHash = await hashPassword('student123');

    const studentUser = await User.create({
      email: 'student@test.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      name: 'Test Student',
      courseType: 'PTE'
    });

    console.log('✓ Test student user created:', {
      email: 'student@test.com',
      password: 'student123',
      role: 'STUDENT',
      courseType: 'PTE'
    });

  } catch (error) {
    console.error('Error creating test users:', error.message);
  }
}

if (require.main === module) {
  createTestUser().then(() => {
    console.log('Done!');
    process.exit(0);
  });
}

module.exports = { createTestUser };