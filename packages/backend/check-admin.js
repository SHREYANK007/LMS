require('dotenv').config();
const { User } = require('./src/models');
const { hashPassword } = require('./src/utils/auth');

async function checkAndResetAdmin() {
  try {
    console.log('Connecting to database...');
    await require('./src/models').sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Check if admin exists
    console.log('Checking for admin user...');
    const admin = await User.findOne({
      where: {
        email: 'admin@lms.com',
        role: 'ADMIN'
      }
    });

    if (admin) {
      console.log('✓ Admin user exists');
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Created: ${admin.createdAt}\n`);

      // Reset password to a known value
      const newPassword = 'admin123';
      const passwordHash = await hashPassword(newPassword);

      await admin.update({ passwordHash });

      console.log('========================================');
      console.log('🔐 ADMIN PASSWORD RESET');
      console.log('========================================');
      console.log(`Email: admin@lms.com`);
      console.log(`New Password: ${newPassword}`);
      console.log('========================================');
      console.log('You can now login with these credentials');
      console.log('========================================\n');
    } else {
      console.log('✗ Admin user not found\n');
      console.log('Creating new admin user...');

      const password = 'admin123';
      const passwordHash = await hashPassword(password);

      const newAdmin = await User.create({
        email: 'admin@lms.com',
        passwordHash,
        role: 'ADMIN'
      });

      console.log('\n========================================');
      console.log('🔐 ADMIN ACCOUNT CREATED');
      console.log('========================================');
      console.log(`Email: admin@lms.com`);
      console.log(`Password: ${password}`);
      console.log('========================================');
      console.log('You can now login with these credentials');
      console.log('========================================\n');
    }

    // List all users
    console.log('All users in database:');
    const allUsers = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt']
    });

    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Created: ${user.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAndResetAdmin();