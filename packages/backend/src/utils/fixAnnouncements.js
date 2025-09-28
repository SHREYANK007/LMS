const { sequelize } = require('../models');

async function fixAnnouncementTables() {
  try {
    console.log('🔧 Fixing announcement tables...');

    // Drop tables in correct order (child first, then parent)
    await sequelize.query('DROP TABLE IF EXISTS announcement_views CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS announcements CASCADE;');

    console.log('✓ Dropped existing announcement tables');

    // Create announcements table
    await sequelize.query(`
      CREATE TABLE announcements (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        priority VARCHAR(50) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'draft',
        target_audience VARCHAR(50) DEFAULT 'all',
        course_type VARCHAR(50),
        author_id UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        publish_date TIMESTAMPTZ,
        expiry_date TIMESTAMPTZ,
        is_global BOOLEAN DEFAULT false,
        view_count INTEGER DEFAULT 0,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log('✓ Created announcements table');

    // Create announcement_views table
    await sequelize.query(`
      CREATE TABLE announcement_views (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE ON UPDATE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        viewed_at TIMESTAMPTZ DEFAULT NOW(),
        acknowledged BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(announcement_id, user_id)
      );
    `);

    console.log('✓ Created announcement_views table');

    // Create enums
    await sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_announcements_type AS ENUM('info', 'urgent', 'offer', 'event', 'materials', 'schedule', 'results', 'success');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_announcements_priority AS ENUM('low', 'medium', 'high');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_announcements_status AS ENUM('draft', 'published', 'archived');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_announcements_target_audience AS ENUM('all', 'pte', 'naati', 'specific');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_announcements_course_type AS ENUM('PTE', 'NAATI', 'ALL');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Remove default constraints and update table columns to use enums
    await sequelize.query(`
      ALTER TABLE announcements
      ALTER COLUMN type DROP DEFAULT,
      ALTER COLUMN priority DROP DEFAULT,
      ALTER COLUMN status DROP DEFAULT,
      ALTER COLUMN target_audience DROP DEFAULT;
    `);

    await sequelize.query(`
      ALTER TABLE announcements
      ALTER COLUMN type TYPE enum_announcements_type USING type::enum_announcements_type,
      ALTER COLUMN priority TYPE enum_announcements_priority USING priority::enum_announcements_priority,
      ALTER COLUMN status TYPE enum_announcements_status USING status::enum_announcements_status,
      ALTER COLUMN target_audience TYPE enum_announcements_target_audience USING target_audience::enum_announcements_target_audience,
      ALTER COLUMN course_type TYPE enum_announcements_course_type USING course_type::enum_announcements_course_type;
    `);

    await sequelize.query(`
      ALTER TABLE announcements
      ALTER COLUMN type SET DEFAULT 'info',
      ALTER COLUMN priority SET DEFAULT 'medium',
      ALTER COLUMN status SET DEFAULT 'draft',
      ALTER COLUMN target_audience SET DEFAULT 'all';
    `);

    console.log('✓ Applied enum types to announcement columns');
    console.log('🎉 Announcement tables fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing announcement tables:', error);
    throw error;
  }
}

if (require.main === module) {
  fixAnnouncementTables()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

module.exports = { fixAnnouncementTables };