require('dotenv').config();
const { sequelize } = require('./src/models');

async function runMigration() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    console.log('Running migration to add user details fields...');

    // Check if columns already exist
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable('users');

    const columnsToAdd = [
      { name: 'name', type: 'STRING' },
      { name: 'course_type', type: 'ENUM' },
      { name: 'phone', type: 'STRING' },
      { name: 'date_of_birth', type: 'DATEONLY' },
      { name: 'emergency_contact', type: 'STRING' },
      { name: 'is_active', type: 'BOOLEAN' },
      { name: 'last_login', type: 'DATE' }
    ];

    for (const column of columnsToAdd) {
      if (!tableDescription[column.name]) {
        console.log(`Adding column: ${column.name}`);

        if (column.name === 'course_type') {
          await queryInterface.addColumn('users', 'course_type', {
            type: sequelize.Sequelize.ENUM('PTE', 'IELTS', 'TOEFL', 'GENERAL_ENGLISH', 'BUSINESS_ENGLISH', 'ACADEMIC_WRITING'),
            allowNull: true
          });
        } else if (column.name === 'name') {
          await queryInterface.addColumn('users', 'name', {
            type: sequelize.Sequelize.STRING,
            allowNull: true
          });
        } else if (column.name === 'phone') {
          await queryInterface.addColumn('users', 'phone', {
            type: sequelize.Sequelize.STRING,
            allowNull: true
          });
        } else if (column.name === 'date_of_birth') {
          await queryInterface.addColumn('users', 'date_of_birth', {
            type: sequelize.Sequelize.DATEONLY,
            allowNull: true
          });
        } else if (column.name === 'emergency_contact') {
          await queryInterface.addColumn('users', 'emergency_contact', {
            type: sequelize.Sequelize.STRING,
            allowNull: true
          });
        } else if (column.name === 'is_active') {
          await queryInterface.addColumn('users', 'is_active', {
            type: sequelize.Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
          });
        } else if (column.name === 'last_login') {
          await queryInterface.addColumn('users', 'last_login', {
            type: sequelize.Sequelize.DATE,
            allowNull: true
          });
        }
      } else {
        console.log(`Column ${column.name} already exists, skipping...`);
      }
    }

    console.log('✓ Migration completed successfully');
    console.log('\nDatabase is now ready with enhanced user fields:');
    console.log('- name (user full name)');
    console.log('- course_type (PTE, IELTS, TOEFL, etc.)');
    console.log('- phone (contact number)');
    console.log('- date_of_birth');
    console.log('- emergency_contact');
    console.log('- is_active (account status)');
    console.log('- last_login (tracking)');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();