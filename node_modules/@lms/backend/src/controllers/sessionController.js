const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { Session, User } = require('../models');
const { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } = require('../utils/googleCalendar');

const createSession = asyncHandler(async (req, res) => {
  const { title, description, startTime, endTime, sessionType, courseType, maxParticipants } = req.body;
  const tutorId = req.user.id;

  if (!title || !startTime || !endTime || !sessionType) {
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
    const calendarEvent = await createCalendarEvent({
      title,
      description,
      startTime: start.toISOString(),
      endTime: end.toISOString()
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

    const sessionWithTutor = await Session.findByPk(session.id, {
      include: [
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'email', 'role']
        }
      ]
    });

    res.status(201).json({
      success: true,
      session: sessionWithTutor
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      error: 'Failed to create session. Please ensure Google Calendar is properly configured.'
    });
  }
});

const getTodaySessions = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sessions = await Session.findAll({
    where: {
      startTime: {
        [Op.gte]: today,
        [Op.lt]: tomorrow
      }
    },
    include: [
      {
        model: User,
        as: 'tutor',
        attributes: ['id', 'email', 'role']
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
  const { tutorId, upcoming } = req.query;
  const where = {};

  if (tutorId) {
    where.tutorId = tutorId;
  }

  if (upcoming === 'true') {
    where.startTime = {
      [Op.gte]: new Date()
    };
  }

  const sessions = await Session.findAll({
    where,
    include: [
      {
        model: User,
        as: 'tutor',
        attributes: ['id', 'email', 'role']
      }
    ],
    order: [['startTime', 'ASC']]
  });

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
        attributes: ['id', 'email', 'role']
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
        attributes: ['id', 'email', 'role']
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

module.exports = {
  createSession,
  getTodaySessions,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession
};