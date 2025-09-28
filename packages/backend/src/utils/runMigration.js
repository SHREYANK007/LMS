const { Sequelize } = require('sequelize');
const config = require('../config/database');

async function runMigration() {
  const sequelize = new Sequelize(config.development);

  try {
    // Mark existing migrations as run
    const existingMigrations = [
      '002-add-user-details.js',
      '002-create-sessions.js',
      '003-enhance-sessions.js',
      '004-add-google-oauth.js',
      '005-create-student-features.js'
    ];

    for (const migration of existingMigrations) {
      await sequelize.query(
        `INSERT INTO "SequelizeMeta" (name) VALUES (:name) ON CONFLICT DO NOTHING`,
        {
          replacements: { name: migration },
          type: Sequelize.QueryTypes.INSERT
        }
      ).catch(() => {}); // Ignore if already exists
    }

    console.log('Migration records updated');

    // Now run the new migration
    const migration = require('../migrations/006-add-tutor-stats-fields.js');
    await migration.up(sequelize.getQueryInterface(), Sequelize);

    // Mark as run
    await sequelize.query(
      `INSERT INTO "SequelizeMeta" (name) VALUES ('006-add-tutor-stats-fields.js')`,
      { type: Sequelize.QueryTypes.INSERT }
    );

    console.log('Migration 006-add-tutor-stats-fields.js completed successfully');

  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error('You may need to manually check if averageRating column and tutor_students table already exist');
  } finally {
    await sequelize.close();
  }
}

runMigration();