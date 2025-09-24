require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require('./src/models');
const { hashPassword, comparePassword } = require('./src/utils/auth');

async function debugPassword() {
  try {
    console.log('=== PASSWORD DEBUG SCRIPT ===\n');

    // Connect to database
    console.log('1. Connecting to database...');
    await require('./src/models').sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Test password hashing
    console.log('2. Testing password hashing...');
    const testPassword = 'admin123';
    const hash1 = await hashPassword(testPassword);
    const hash2 = await bcrypt.hash(testPassword, 10);

    console.log(`Original password: ${testPassword}`);
    console.log(`Hash using hashPassword(): ${hash1}`);
    console.log(`Hash using bcrypt directly: ${hash2}`);

    const compare1 = await comparePassword(testPassword, hash1);
    const compare2 = await bcrypt.compare(testPassword, hash1);

    console.log(`comparePassword() result: ${compare1}`);
    console.log(`bcrypt.compare() result: ${compare2}\n`);

    // Check admin user
    console.log('3. Checking admin user in database...');
    const admin = await User.findOne({
      where: { email: 'admin@lms.com' }
    });

    if (!admin) {
      console.log('✗ Admin user not found!\n');
      console.log('Creating admin user with password "admin123"...');

      const passwordHash = await hashPassword('admin123');
      const newAdmin = await User.create({
        email: 'admin@lms.com',
        passwordHash: passwordHash,
        role: 'ADMIN'
      });

      console.log('✓ Admin created successfully');
      console.log(`  ID: ${newAdmin.id}`);
      console.log(`  Email: ${newAdmin.email}`);
      console.log(`  Role: ${newAdmin.role}`);
      console.log(`  Password Hash: ${newAdmin.passwordHash}\n`);
    } else {
      console.log('✓ Admin user found');
      console.log(`  ID: ${admin.id}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Created: ${admin.createdAt}`);
      console.log(`  Current Password Hash: ${admin.passwordHash}\n`);

      // Test current password
      console.log('4. Testing password "admin123" against stored hash...');
      const isValid = await comparePassword('admin123', admin.passwordHash);
      const isValidDirect = await bcrypt.compare('admin123', admin.passwordHash);

      console.log(`  comparePassword() result: ${isValid}`);
      console.log(`  bcrypt.compare() direct result: ${isValidDirect}\n`);

      if (!isValid) {
        console.log('5. Password does not match. Resetting to "admin123"...');
        const newPasswordHash = await hashPassword('admin123');

        await admin.update({ passwordHash: newPasswordHash });
        console.log('✓ Password reset successfully');
        console.log(`  New hash: ${newPasswordHash}\n`);

        // Verify the update
        const updatedAdmin = await User.findOne({
          where: { email: 'admin@lms.com' }
        });

        const verifyNew = await comparePassword('admin123', updatedAdmin.passwordHash);
        console.log(`  Verification after reset: ${verifyNew}\n`);
      } else {
        console.log('✓ Password "admin123" is already valid!\n');
      }
    }

    // Final test
    console.log('6. Final login test...');
    const finalAdmin = await User.findOne({
      where: { email: 'admin@lms.com' }
    });

    if (finalAdmin) {
      const finalTest = await comparePassword('admin123', finalAdmin.passwordHash);
      console.log(`  Password "admin123" works: ${finalTest}`);

      if (finalTest) {
        console.log('\n========================================');
        console.log('✓ ADMIN LOGIN READY');
        console.log('========================================');
        console.log('Email: admin@lms.com');
        console.log('Password: admin123');
        console.log('========================================\n');
      }
    }

    // Check JWT_SECRET
    console.log('7. Checking JWT configuration...');
    console.log(`  JWT_SECRET exists: ${!!process.env.JWT_SECRET}`);
    console.log(`  JWT_SECRET value: ${process.env.JWT_SECRET ? '[HIDDEN]' : 'NOT SET!'}`);
    console.log(`  JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN || '7d (default)'}\n`);

    if (!process.env.JWT_SECRET) {
      console.log('⚠️  WARNING: JWT_SECRET is not set in .env file!');
      console.log('  Add this to your .env file: JWT_SECRET=your_secret_key_here\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

debugPassword();