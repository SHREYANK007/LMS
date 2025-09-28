const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { Session, User, TutorStudent, sequelize } = require('../models');
const googleOAuthService = require('../services/googleOAuthService');
const { getValidTokens } = require('./googleOAuthController');
const { getTutorAssignedStudentIds } = require('../middleware/tutorAccess');

const createSession = asyncHandler(async (req, res) => {
  console.log('Session creation request received:', {
    body: req.body,
    user: req.user?.id,
    userRole: req.user?.role
  });

  const { title, description, startTime, endTime, sessionType, courseType, maxParticipants } = req.body;
  const tutorId = req.user.id;

  if (!title || !startTime || !endTime || !sessionType) {
    console.log('Missing required fields:', { title: !!title, startTime: !!startTime, endTime: !!endTime, sessionType: !!sessionType });
    return res.status(400).json({
      error: 'Title, start time, end time, and session type are required'
    });
  }

  // Validate session type
  const validSessionTypes = ['ONE_TO_ONE', 'SMART_QUAD', 'MASTERCLASS'];
  if (!validSessionTypes.includes(sessionType)) {
    return res.status(400).json({
      error: 'Invalid session type. Must be ONE_TO_ONE, SMART_QUAD, or MASTERCLASS'
    });
  }

  // Set default max participants based on session type
  let defaultMaxParticipants = 1;
  if (sessionType === 'SMART_QUAD') {
    defaultMaxParticipants = 4;
  } else if (sessionType === 'MASTERCLASS') {
    defaultMaxParticipants = 15;
  }

  const finalMaxParticipants = maxParticipants || defaultMaxParticipants;

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    return res.status(400).json({
      error: 'End time must be after start time'
    });
  }

  if (start < new Date()) {
    return res.status(400).json({
      error: 'Start time cannot be in the past'
    });
  }

  try {
    // Get the full user object with Google credentials
    console.log('Fetching user for tutor ID:', tutorId);
    const user = await User.findByPk(tutorId);

    let calendarEvent = { eventId: null, meetLink: null, htmlLink: null };

    // Only create calendar event if user has connected Google Calendar
    if (user && user.googleCalendarConnected) {
      console.log('✅ User has Google Calendar connected, attempting to create calendar event');
      console.log('User calendar data:', {
        googleCalendarConnected: user.googleCalendarConnected,
        googleEmail: user.googleEmail,
        hasAccessToken: !!user.googleAccessToken,
        hasRefreshToken: !!user.googleRefreshToken,
        tokenExpiry: user.googleTokenExpiry
      });

      try {
        // Get valid tokens for the user
        console.log('🔄 Getting valid tokens for user...');
        const tokens = await getValidTokens(user);
        console.log('✅ Valid tokens obtained:', {
          hasAccessToken: !!tokens.access_token,
          hasRefreshToken: !!tokens.refresh_token,
          expiryDate: tokens.expiry_date
        });

        // Create the calendar event with Meet link using OAuth service
        console.log('📅 Creating calendar event with data:', {
          title,
          description,
          startTime: start.toISOString(),
          endTime: end.toISOString()
        });

        calendarEvent = await googleOAuthService.createCalendarEvent(tokens, {
          title,
          description,
          startTime: start.toISOString(),
          endTime: end.toISOString()
        });

        console.log('✅ Calendar event created successfully:', calendarEvent);
      } catch (calendarError) {
        console.error('❌ Failed to create calendar event:', {
          message: calendarError.message,
          stack: calendarError.stack,
          name: calendarError.name
        });
        // Don't fail the entire session creation if calendar fails
      }
    } else {
      console.log('⚠️  User does not have Google Calendar connected or user not found:', {
        userExists: !!user,
        googleCalendarConnected: user?.googleCalendarConnected,
        userEmail: user?.email
      });
    }

    console.log('Creating session with data:', {
      title,
      description,
      tutorId,
      startTime: start,
      endTime: end,
      sessionType,
      courseType,
      maxParticipants: finalMaxParticipants,
      calendarEventId: calendarEvent.eventId,
      meetLink: calendarEvent.meetLink
    });

    const session = await Session.create({
      title,
      description,
      tutorId,
      eventId: calendarEvent.eventId,
      meetLink: calendarEvent.meetLink,
      startTime: start,
      endTime: end,
      sessionType,
      courseType,
      maxParticipants: finalMaxParticipants,
      currentParticipants: 0,
      calendarEventUrl: calendarEvent.htmlLink
    });

    console.log('Session created successfully with ID:', session.id);

    const sessionWithTutor = await Session.findByPk(session.id, {
      include: [
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    res.status(201).json({
      success: true,
      session: sessionWithTutor
    });
  } catch (error) {
    console.error('Error creating session:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      error: `Failed to create session: ${error.message}`
    });
  }
});

const getTodaySessions = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let where = {
    startTime: {
      [Op.gte]: today,
      [Op.lt]: tomorrow
    }
  };

  // For tutors, only show their own sessions
  if (req.user.role === 'TUTOR') {
    where.tutorId = req.user.id;
  } else if (req.user.role === 'STUDENT') {
    // For students, show sessions from their assigned tutors OR masterclasses for their course type
    const orConditions = [];

    // Add assigned tutor sessions if student has assigned tutors
    if (req.assignedTutorIds && req.assignedTutorIds.length > 0) {
      orConditions.push({
        tutorId: { [Op.in]: req.assignedTutorIds }
      });
    }

    // Always add masterclass condition if user has a course type
    if (req.user.courseType) {
      orConditions.push({
        sessionType: 'MASTERCLASS',
        courseType: req.user.courseType
      });
    }

    // Only set OR condition if we have conditions to apply
    if (orConditions.length > 0) {
      where = {
        [Op.and]: [
          { startTime: { [Op.gte]: today, [Op.lt]: tomorrow } },
          { [Op.or]: orConditions }
        ]
      };
    }
  }

  const sessions = await Session.findAll({
    where,
    include: [
      {
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email', 'role']
      }
    ],
    order: [['startTime', 'ASC']]
  });

  res.json({
    success: true,
    sessions
  });
});

const getAllSessions = asyncHandler(async (req, res) => {
  console.log('getAllSessions request:', {
    query: req.query,
    userId: req.user?.id,
    userRole: req.user?.role,
    userCourseType: req.user?.courseType,
    assignedTutorIds: req.assignedTutorIds
  });

  const { tutorId, upcoming } = req.query;
  let where = {};

  // For tutors, only show their own sessions
  if (req.user.role === 'TUTOR') {
    where.tutorId = req.user.id;
  } else if (req.user.role === 'STUDENT') {
    // For students, show sessions from their assigned tutors OR masterclasses for their course type
    const orConditions = [];

    // Add assigned tutor sessions if student has assigned tutors
    if (req.assignedTutorIds && req.assignedTutorIds.length > 0) {
      orConditions.push({
        tutorId: { [Op.in]: req.assignedTutorIds }
      });
    }

    // Always add masterclass condition if user has a course type
    if (req.user.courseType) {
      orConditions.push({
        sessionType: 'MASTERCLASS',
        courseType: req.user.courseType
      });
    }

    // Only set OR condition if we have conditions to apply
    if (orConditions.length > 0) {
      where = {
        [Op.or]: orConditions
      };
    }
  } else if (tutorId) {
    where.tutorId = tutorId;
  }

  if (upcoming === 'true') {
    // If we already have an [Op.or] clause, we need to combine with [Op.and]
    if (where[Op.or]) {
      where = {
        [Op.and]: [
          { [Op.or]: where[Op.or] },
          { startTime: { [Op.gte]: new Date() } }
        ]
      };
    } else {
      where.startTime = {
        [Op.gte]: new Date()
      };
    }
  }

  console.log('Session query where clause:', JSON.stringify(where, null, 2));

  const sessions = await Session.findAll({
    where,
    include: [
      {
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email', 'role']
      }
    ],
    order: [['startTime', 'ASC']]
  });

  console.log(`Found ${sessions.length} sessions matching criteria`);
  console.log('Session details:', sessions.map(s => ({
    id: s.id,
    title: s.title,
    tutorId: s.tutorId,
    startTime: s.startTime,
    sessionType: s.sessionType,
    courseType: s.courseType
  })));

  res.json({
    success: true,
    sessions
  });
});

const getSessionById = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findByPk(sessionId, {
    include: [
      {
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email', 'role']
      }
    ]
  });

  if (!session) {
    return res.status(404).json({
      error: 'Session not found'
    });
  }

  res.json({
    success: true,
    session
  });
});

const updateSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { title, description, startTime, endTime } = req.body;

  const session = await Session.findByPk(sessionId);

  if (!session) {
    return res.status(404).json({
      error: 'Session not found'
    });
  }

  if (req.user.role === 'TUTOR' && session.tutorId !== req.user.id) {
    return res.status(403).json({
      error: 'You can only update your own sessions'
    });
  }

  const updates = {};

  if (title) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (startTime) updates.startTime = new Date(startTime);
  if (endTime) updates.endTime = new Date(endTime);

  if (updates.startTime && updates.endTime) {
    if (updates.startTime >= updates.endTime) {
      return res.status(400).json({
        error: 'End time must be after start time'
      });
    }
  }

  if (session.eventId) {
    try {
      await updateCalendarEvent(session.eventId, {
        title: updates.title || session.title,
        description: updates.description ?? session.description,
        startTime: (updates.startTime || session.startTime).toISOString(),
        endTime: (updates.endTime || session.endTime).toISOString()
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
    }
  }

  await session.update(updates);

  const updatedSession = await Session.findByPk(sessionId, {
    include: [
      {
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email', 'role']
      }
    ]
  });

  res.json({
    success: true,
    session: updatedSession
  });
});

const deleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findByPk(sessionId);

  if (!session) {
    return res.status(404).json({
      error: 'Session not found'
    });
  }

  if (req.user.role === 'TUTOR' && session.tutorId !== req.user.id) {
    return res.status(403).json({
      error: 'You can only delete your own sessions'
    });
  }

  if (session.eventId) {
    try {
      await deleteCalendarEvent(session.eventId);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
    }
  }

  await session.destroy();

  res.json({
    success: true,
    message: 'Session deleted successfully'
  });
});

// Create masterclass with automatic student enrollment
const createMasterclass = asyncHandler(async (req, res) => {
  console.log('Masterclass creation request received:', {
    body: req.body,
    user: req.user?.id,
    userRole: req.user?.role
  });

  // Only admins can create masterclasses
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Only administrators can create masterclasses'
    });
  }

  const {
    title,
    description,
    courseType,
    startDateTime,
    endDateTime,
    maxParticipants,
    meetingLink
  } = req.body;

  if (!title || !courseType || !startDateTime || !endDateTime) {
    return res.status(400).json({
      error: 'Title, course type, start time, and end time are required'
    });
  }

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (start >= end) {
    return res.status(400).json({
      error: 'End time must be after start time'
    });
  }

  if (start <= new Date()) {
    return res.status(400).json({
      error: 'Start time must be in the future'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Create the masterclass session
    const session = await Session.create({
      title,
      description,
      tutorId: req.user.id, // Admin as the creator
      startTime: start,
      endTime: end,
      sessionType: 'MASTERCLASS',
      courseType,
      maxParticipants: maxParticipants || 30,
      currentParticipants: 0,
      meetLink: meetingLink,
      status: 'SCHEDULED'
    }, { transaction });

    // Find all students enrolled in the specified course
    const enrolledStudents = await User.findAll({
      where: {
        role: 'STUDENT',
        courseType: courseType,
        isActive: true
      },
      attributes: ['id', 'email', 'name', 'googleEmail', 'googleCalendarConnected']
    }, { transaction });

    console.log(`Found ${enrolledStudents.length} students enrolled in ${courseType} course`);

    // Create calendar events for all enrolled students
    const calendarResults = {
      successful: [],
      failed: [],
      totalStudents: enrolledStudents.length
    };

    // Get admin's Google credentials for creating the main event
    const admin = await User.findByPk(req.user.id);
    let mainEventId = null;
    let meetLinkGenerated = meetingLink;

    if (admin.googleCalendarConnected) {
      try {
        const adminTokens = await getValidTokens(admin);

        // Create main calendar event
        const eventDetails = {
          title: title,
          description: `Masterclass for ${courseType} students\n\n${description || ''}`,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          attendees: enrolledStudents.map(student => ({
            email: student.googleEmail || student.email
          }))
        };

        const mainEvent = await googleOAuthService.createCalendarEvent(adminTokens, eventDetails);
        mainEventId = mainEvent.id;

        // Use generated meet link if none provided
        if (!meetingLink && mainEvent.hangoutLink) {
          meetLinkGenerated = mainEvent.hangoutLink;
          await session.update({ meetLink: meetLinkGenerated }, { transaction });
        }

        console.log('Main calendar event created:', mainEventId);
      } catch (error) {
        console.error('Error creating main calendar event:', error);
      }
    }

    // Send calendar invites to each student
    for (const student of enrolledStudents) {
      try {
        if (student.googleCalendarConnected) {
          const studentTokens = await getValidTokens(student);

          const studentEventDetails = {
            title: `${title} - ${courseType} Masterclass`,
            description: `You're invited to join this ${courseType} masterclass!\n\n${description || ''}\n\nMeeting Link: ${meetLinkGenerated || 'Will be provided before the session'}`,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            attendees: [{ email: admin.googleEmail || admin.email }]
          };

          const studentEvent = await googleOAuthService.createCalendarEvent(studentTokens, studentEventDetails);

          calendarResults.successful.push({
            studentId: student.id,
            email: student.email,
            eventId: studentEvent.id
          });
        } else {
          calendarResults.failed.push({
            studentId: student.id,
            email: student.email,
            reason: 'Google Calendar not connected'
          });
        }
      } catch (error) {
        console.error(`Error creating calendar event for student ${student.email}:`, error);
        calendarResults.failed.push({
          studentId: student.id,
          email: student.email,
          reason: error.message
        });
      }
    }

    // Update session with event ID
    if (mainEventId) {
      await session.update({ eventId: mainEventId }, { transaction });
    }

    await transaction.commit();

    // Log the masterclass creation
    console.log(`[MASTERCLASS CREATED] Admin: ${req.user.email} created masterclass: ${title} for ${courseType} course. ${calendarResults.successful.length}/${calendarResults.totalStudents} students successfully invited.`);

    res.status(201).json({
      success: true,
      message: 'Masterclass created successfully',
      session: {
        id: session.id,
        title: session.title,
        description: session.description,
        courseType: session.courseType,
        startTime: session.startTime,
        endTime: session.endTime,
        maxParticipants: session.maxParticipants,
        meetLink: session.meetLink,
        status: session.status
      },
      calendarInvites: calendarResults
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating masterclass:', error);
    res.status(500).json({
      error: 'Failed to create masterclass',
      details: error.message
    });
  }
});

module.exports = {
  createSession,
  getTodaySessions,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  createMasterclass
};