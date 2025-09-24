const asyncHandler = require('express-async-handler');
const { Session, User } = require('../models');
const googleOAuthService = require('../services/googleOAuthService');
const { getValidTokens } = require('./googleOAuthController');

// Create a new Smart Quad session
const createSmartQuadSession = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startTime,
    endTime,
    courseType,
    maxParticipants = 4
  } = req.body;

  const tutorId = req.user.id;

  // Validation
  if (!title || !startTime || !endTime || !courseType) {
    return res.status(400).json({
      error: 'Title, start time, end time, and course type are required'
    });
  }

  // Validate course type
  const validCourseTypes = ['PTE', 'IELTS', 'TOEFL', 'GENERAL_ENGLISH', 'BUSINESS_ENGLISH', 'ACADEMIC_WRITING'];
  if (!validCourseTypes.includes(courseType)) {
    return res.status(400).json({
      error: 'Invalid course type. Must be one of: ' + validCourseTypes.join(', ')
    });
  }

  // Validate time
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (start <= now) {
    return res.status(400).json({
      error: 'Start time must be in the future'
    });
  }

  if (end <= start) {
    return res.status(400).json({
      error: 'End time must be after start time'
    });
  }

  // Check session duration (should be reasonable)
  const durationHours = (end - start) / (1000 * 60 * 60);
  if (durationHours < 0.5 || durationHours > 4) {
    return res.status(400).json({
      error: 'Session duration must be between 30 minutes and 4 hours'
    });
  }

  try {
    // Get tutor information
    const tutor = await User.findByPk(tutorId);
    if (!tutor) {
      return res.status(404).json({
        error: 'Tutor not found'
      });
    }

    let calendarEventData = null;

    // Create Google Calendar event if user has connected their calendar
    if (tutor.googleCalendarConnected) {
      try {
        const tokens = await getValidTokens(tutor);

        calendarEventData = await googleOAuthService.createCalendarEvent(tokens, {
          title: `Smart Quad: ${title}`,
          description: description || `Smart Quad session for ${courseType}`,
          startTime,
          endTime,
          timeZone: 'America/New_York'
        });

        console.log('Google Calendar event created successfully:', calendarEventData.eventId);
      } catch (calendarError) {
        console.error('Failed to create Google Calendar event:', calendarError);
        // Continue without calendar integration - don't fail the entire request
        console.warn('Session will be created without Google Calendar integration');
      }
    } else {
      console.warn('Tutor has not connected Google Calendar - creating session without calendar integration');
    }

    // Create session in database
    const session = await Session.create({
      title,
      description: description || `Smart Quad session for ${courseType}`,
      tutorId,
      startTime,
      endTime,
      sessionType: 'SMART_QUAD',
      courseType,
      maxParticipants,
      currentParticipants: 0,
      eventId: calendarEventData?.eventId || null,
      meetLink: calendarEventData?.meetLink || null,
      calendarEventUrl: calendarEventData?.htmlLink || null,
      status: 'SCHEDULED'
    });

    // Return session with tutor info
    const sessionWithTutor = await Session.findByPk(session.id, {
      include: [{
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      session: {
        id: sessionWithTutor.id,
        title: sessionWithTutor.title,
        description: sessionWithTutor.description,
        startTime: sessionWithTutor.startTime,
        endTime: sessionWithTutor.endTime,
        sessionType: sessionWithTutor.sessionType,
        courseType: sessionWithTutor.courseType,
        maxParticipants: sessionWithTutor.maxParticipants,
        currentParticipants: sessionWithTutor.currentParticipants,
        meetLink: sessionWithTutor.meetLink,
        calendarEventUrl: sessionWithTutor.calendarEventUrl,
        status: sessionWithTutor.status,
        tutor: sessionWithTutor.tutor,
        createdAt: sessionWithTutor.createdAt
      },
      calendarIntegration: {
        enabled: !!calendarEventData,
        eventId: calendarEventData?.eventId,
        meetLinkGenerated: !!calendarEventData?.meetLink
      }
    });

  } catch (error) {
    console.error('Error creating Smart Quad session:', error);
    res.status(500).json({
      error: 'Failed to create session. Please try again.'
    });
  }
});

// Get all Smart Quad sessions for a tutor
const getTutorSmartQuadSessions = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;
  const { upcoming = false, past = false } = req.query;

  try {
    let whereClause = {
      tutorId,
      sessionType: 'SMART_QUAD'
    };

    // Filter by time if specified
    const now = new Date();
    if (upcoming === 'true') {
      whereClause.startTime = { [require('sequelize').Op.gte]: now };
    } else if (past === 'true') {
      whereClause.startTime = { [require('sequelize').Op.lt]: now };
    }

    const sessions = await Session.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email']
      }],
      order: [['startTime', upcoming === 'true' ? 'ASC' : 'DESC']]
    });

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description,
        startTime: session.startTime,
        endTime: session.endTime,
        sessionType: session.sessionType,
        courseType: session.courseType,
        maxParticipants: session.maxParticipants,
        currentParticipants: session.currentParticipants,
        meetLink: session.meetLink,
        calendarEventUrl: session.calendarEventUrl,
        status: session.status,
        tutor: session.tutor,
        createdAt: session.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching Smart Quad sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch sessions'
    });
  }
});

// Get all available Smart Quad sessions (for students to join)
const getAvailableSmartQuadSessions = asyncHandler(async (req, res) => {
  const { courseType } = req.query;

  try {
    let whereClause = {
      sessionType: 'SMART_QUAD',
      startTime: { [require('sequelize').Op.gte]: new Date() },
      status: 'SCHEDULED'
    };

    // Filter by course type if specified
    if (courseType) {
      whereClause.courseType = courseType;
    }

    const sessions = await Session.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email']
      }],
      order: [['startTime', 'ASC']]
    });

    // Filter sessions that still have available spots
    const availableSessions = sessions.filter(session =>
      session.currentParticipants < session.maxParticipants
    );

    res.json({
      success: true,
      sessions: availableSessions.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description,
        startTime: session.startTime,
        endTime: session.endTime,
        sessionType: session.sessionType,
        courseType: session.courseType,
        maxParticipants: session.maxParticipants,
        currentParticipants: session.currentParticipants,
        availableSpots: session.maxParticipants - session.currentParticipants,
        meetLink: session.meetLink,
        status: session.status,
        tutor: {
          id: session.tutor.id,
          name: session.tutor.name
        },
        createdAt: session.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching available Smart Quad sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch available sessions'
    });
  }
});

// Update a Smart Quad session
const updateSmartQuadSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const tutorId = req.user.id;
  const updates = req.body;

  try {
    const session = await Session.findOne({
      where: {
        id: sessionId,
        tutorId,
        sessionType: 'SMART_QUAD'
      }
    });

    if (!session) {
      return res.status(404).json({
        error: 'Smart Quad session not found or you do not have permission to update it'
      });
    }

    // Update Google Calendar event if it exists and service is configured
    if (session.eventId && googleCalendarService.isConfigured()) {
      try {
        const calendarUpdates = {};

        if (updates.title) {
          calendarUpdates.summary = `Smart Quad: ${updates.title}`;
        }

        if (updates.description) {
          calendarUpdates.description = updates.description;
        }

        if (updates.startTime) {
          calendarUpdates.start = {
            dateTime: new Date(updates.startTime).toISOString(),
            timeZone: 'UTC'
          };
        }

        if (updates.endTime) {
          calendarUpdates.end = {
            dateTime: new Date(updates.endTime).toISOString(),
            timeZone: 'UTC'
          };
        }

        if (Object.keys(calendarUpdates).length > 0) {
          await googleCalendarService.updateCalendarEvent(session.eventId, calendarUpdates);
        }

      } catch (calendarError) {
        console.error('Failed to update Google Calendar event:', calendarError);
        // Continue with database update even if calendar update fails
      }
    }

    // Update session in database
    await session.update(updates);

    // Fetch updated session with tutor info
    const updatedSession = await Session.findByPk(session.id, {
      include: [{
        model: User,
        as: 'tutor',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      session: updatedSession
    });

  } catch (error) {
    console.error('Error updating Smart Quad session:', error);
    res.status(500).json({
      error: 'Failed to update session'
    });
  }
});

// Delete a Smart Quad session
const deleteSmartQuadSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const tutorId = req.user.id;

  try {
    const session = await Session.findOne({
      where: {
        id: sessionId,
        tutorId,
        sessionType: 'SMART_QUAD'
      }
    });

    if (!session) {
      return res.status(404).json({
        error: 'Smart Quad session not found or you do not have permission to delete it'
      });
    }

    // Delete Google Calendar event if it exists
    if (session.eventId && googleCalendarService.isConfigured()) {
      try {
        await googleCalendarService.deleteCalendarEvent(session.eventId);
      } catch (calendarError) {
        console.error('Failed to delete Google Calendar event:', calendarError);
        // Continue with database deletion even if calendar deletion fails
      }
    }

    // Delete session from database
    await session.destroy();

    res.json({
      success: true,
      message: 'Smart Quad session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting Smart Quad session:', error);
    res.status(500).json({
      error: 'Failed to delete session'
    });
  }
});

module.exports = {
  createSmartQuadSession,
  getTutorSmartQuadSessions,
  getAvailableSmartQuadSessions,
  updateSmartQuadSession,
  deleteSmartQuadSession
};