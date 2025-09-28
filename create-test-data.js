const { User, TutorStudent, sequelize } = require('./packages/backend/src/models');
const { hashPassword } = require('./packages/backend/src/utils/auth');

const createTestData = async () => {
  try {
    console.log('🔄 Creating test data...');

    // Create admin user
    let admin;
    try {
      admin = await User.create({
        email: 'admin@lms.com',
        passwordHash: await hashPassword('admin123'),
        role: 'ADMIN',
        name: 'System Administrator'
      });
      console.log('✅ Admin created: admin@lms.com / admin123');
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        admin = await User.findOne({ where: { email: 'admin@lms.com' } });
        console.log('✅ Admin already exists: admin@lms.com');
      } else {
        throw error;
      }
    }

    // Create tutors
    const tutors = [];
    const tutorData = [
      { email: 'john.smith@lms.com', name: 'John Smith', password: 'tutor123' },
      { email: 'sarah.wilson@lms.com', name: 'Dr. Sarah Wilson', password: 'tutor123' },
      { email: 'michael.chen@lms.com', name: 'Michael Chen', password: 'tutor123' }
    ];

    for (const tutorInfo of tutorData) {
      try {
        const tutor = await User.create({
          email: tutorInfo.email,
          passwordHash: await hashPassword(tutorInfo.password),
          role: 'TUTOR',
          name: tutorInfo.name
        });
        tutors.push(tutor);
        console.log(`✅ Tutor created: ${tutorInfo.email} / ${tutorInfo.password}`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          const existingTutor = await User.findOne({ where: { email: tutorInfo.email } });
          tutors.push(existingTutor);
          console.log(`✅ Tutor already exists: ${tutorInfo.email}`);
        } else {
          throw error;
        }
      }
    }

    // Create students
    const students = [];
    const studentData = [
      { email: 'alice.johnson@student.com', name: 'Alice Johnson', password: 'student123' },
      { email: 'bob.brown@student.com', name: 'Bob Brown', password: 'student123' },
      { email: 'charlie.davis@student.com', name: 'Charlie Davis', password: 'student123' },
      { email: 'diana.miller@student.com', name: 'Diana Miller', password: 'student123' }
    ];

    for (const studentInfo of studentData) {
      try {
        const student = await User.create({
          email: studentInfo.email,
          passwordHash: await hashPassword(studentInfo.password),
          role: 'STUDENT',
          name: studentInfo.name,
          courseType: 'PTE'
        });
        students.push(student);
        console.log(`✅ Student created: ${studentInfo.email} / ${studentInfo.password}`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          const existingStudent = await User.findOne({ where: { email: studentInfo.email } });
          students.push(existingStudent);
          console.log(`✅ Student already exists: ${studentInfo.email}`);
        } else {
          throw error;
        }
      }
    }

    // Create tutor-student assignments
    const assignments = [
      { studentIndex: 0, tutorIndex: 0 }, // Alice -> John Smith
      { studentIndex: 0, tutorIndex: 1 }, // Alice -> Dr. Sarah Wilson
      { studentIndex: 1, tutorIndex: 0 }, // Bob -> John Smith
      { studentIndex: 1, tutorIndex: 2 }, // Bob -> Michael Chen
      { studentIndex: 2, tutorIndex: 1 }, // Charlie -> Dr. Sarah Wilson
      { studentIndex: 3, tutorIndex: 2 }, // Diana -> Michael Chen
    ];

    for (const assignment of assignments) {
      try {
        await TutorStudent.create({
          student_id: students[assignment.studentIndex].id,
          tutor_id: tutors[assignment.tutorIndex].id
        });
        console.log(`✅ Assignment created: ${students[assignment.studentIndex].name} -> ${tutors[assignment.tutorIndex].name}`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`✅ Assignment already exists: ${students[assignment.studentIndex].name} -> ${tutors[assignment.tutorIndex].name}`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n🎉 Test data creation completed!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@lms.com / admin123');
    console.log('Tutors: john.smith@lms.com, sarah.wilson@lms.com, michael.chen@lms.com / tutor123');
    console.log('Students: alice.johnson@student.com, bob.brown@student.com, charlie.davis@student.com, diana.miller@student.com / student123');
    console.log('\n🔗 Student-Tutor Assignments:');
    console.log('- Alice Johnson: assigned to John Smith & Dr. Sarah Wilson');
    console.log('- Bob Brown: assigned to John Smith & Michael Chen');
    console.log('- Charlie Davis: assigned to Dr. Sarah Wilson');
    console.log('- Diana Miller: assigned to Michael Chen');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
createTestData();