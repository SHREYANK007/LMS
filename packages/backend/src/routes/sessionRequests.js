const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin, requireStudent } = require('../middleware/auth');
const { SessionRequest, User } = require('../models');
const calendarService = require('../services/calendarService');

// Get all session requests (Admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const requests = await SessionRequest.findAll({
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching session requests:', error);
    res.status(500).json({ error: 'Failed to fetch session requests' });
  }
});

// Get session requests for a specific student
router.get('/my-requests', authenticate, requireStudent, async (req, res) => {
  try {
    const requests = await SessionRequest.findAll({
      where: { studentId: req.user.id },
      include: [
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching student session requests:', error);
    res.status(500).json({ error: 'Failed to fetch your session requests' });
  }
});

// Create a new session request (Student only)
router.post('/', authenticate, requireStudent, async (req, res) => {
  try {
    const {
      preferredDate,
      preferredTime,
      duration,
      subject,
      description
    } = req.body;

    // Validate required fields
    if (!preferredDate || !preferredTime || !subject) {
      return res.status(400).json({
        error: 'Preferred date, time, and subject are required'
      });
    }

    const request = await SessionRequest.create({
      studentId: req.user.id,
      preferredDate,
      preferredTime,
      duration: duration || 60,
      subject,
      description,
      status: 'PENDING'
    });

    // Fetch the created request with associations
    const createdRequest = await SessionRequest.findByPk(request.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Session request created successfully',
      request: createdRequest
    });
  } catch (error) {
    console.error('Error creating session request:', error);
    res.status(500).json({ error: 'Failed to create session request' });
  }
});

// Assign a tutor to a session request and create calendar event (Admin only)
router.put('/:id/assign', authenticate, requireAdmin, async (req, res) => {
  try {
    const { tutorId, adminNotes, scheduledDateTime } = req.body;

    if (!tutorId) {
      return res.status(400).json({ error: 'Tutor ID is required' });
    }

    const request = await SessionRequest.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone', 'googleCalendarConnected', 'googleEmail']
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ error: 'Session request not found' });
    }

    // Get student with Google credentials
    const student = await User.findOne({
      where: { id: request.studentId },
      attributes: ['id', 'name', 'email', 'phone', 'googleCalendarConnected',
                   'googleAccessToken', 'googleRefreshToken', 'googleTokenExpiry', 'googleEmail']
    });

    // Verify tutor exists and has TUTOR role
    const tutor = await User.findOne({
      where: { id: tutorId, role: 'TUTOR' },
      attributes: ['id', 'name', 'email', 'phone', 'googleCalendarConnected',
                   'googleAccessToken', 'googleRefreshToken', 'googleTokenExpiry', 'googleEmail']
    });

    if (!tutor) {
      return res.status(400).json({ error: 'Invalid tutor selected' });
    }

    // Determine scheduled date and time
    let sessionDateTime;
    if (scheduledDateTime) {
      sessionDateTime = new Date(scheduledDateTime);
    } else {
      // Use preferred date and time from request
      const [hours, minutes] = request.preferredTime.split(':');
      sessionDateTime = new Date(request.preferredDate);
      sessionDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    // Calculate end time based on duration
    const endDateTime = new Date(sessionDateTime.getTime() + request.duration * 60000);

    let calendarEventId = null;
    let tutorCalendarEventId = null;
    let studentCalendarEventId = null;
    let meetLink = null;
    let calendarEventLink = null;

    // Try to create calendar events for both tutor and student
    try {
      const sessionDetails = {
        subject: request.subject,
        description: request.description,
        startTime: sessionDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      };

      const calendarResults = await calendarService.createSessionCalendarEvents(
        tutor,
        student,
        sessionDetails
      );

      // Store the results
      if (calendarResults.tutorEvent) {
        tutorCalendarEventId = calendarResults.tutorEvent.eventId;
        calendarEventId = calendarResults.tutorEvent.eventId; // Keep for backward compatibility
        calendarEventLink = calendarResults.tutorEvent.htmlLink;
      }

      if (calendarResults.studentEvent) {
        studentCalendarEventId = calendarResults.studentEvent.eventId;
        // Use student's calendar link if tutor doesn't have one
        if (!calendarEventLink) {
          calendarEventLink = calendarResults.studentEvent.htmlLink;
        }
      }

      meetLink = calendarResults.meetLink;

      if (calendarResults.errors.length > 0) {
        console.error('Some calendar events failed:', calendarResults.errors);
      }

      console.log('Calendar events created:', {
        tutorEventId: tutorCalendarEventId,
        studentEventId: studentCalendarEventId,
        meetLink: meetLink
      });
    } catch (calendarError) {
      console.error('Failed to create calendar events:', calendarError);
      // Continue without calendar events - don't fail the entire operation
    }

    // Update the request with tutor assignment and calendar details
    await request.update({
      tutorId,
      adminNotes,
      status: 'ASSIGNED',
      scheduledDateTime: sessionDateTime,
      calendarEventId,
      tutorCalendarEventId,
      studentCalendarEventId,
      meetLink,
      calendarEventLink
    });

    const updatedRequest = await SessionRequest.findByPk(request.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: meetLink ? 'Tutor assigned and calendar events created successfully' : 'Tutor assigned successfully',
      request: updatedRequest,
      calendarEvent: meetLink ? {
        meetLink,
        calendarLink: calendarEventLink,
        tutorEventCreated: !!tutorCalendarEventId,
        studentEventCreated: !!studentCalendarEventId
      } : null
    });
  } catch (error) {
    console.error('Error assigning tutor:', error);
    res.status(500).json({ error: 'Failed to assign tutor' });
  }
});

// Update session request status (Admin only)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const request = await SessionRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Session request not found' });
    }

    const updateData = { status };
    if (status === 'REJECTED' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    await request.update(updateData);

    const updatedRequest = await SessionRequest.findByPk(request.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Status updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Cancel a session request (Student only, for their own requests)
router.put('/:id/cancel', authenticate, requireStudent, async (req, res) => {
  try {
    const request = await SessionRequest.findOne({
      where: {
        id: req.params.id,
        studentId: req.user.id
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Session request not found' });
    }

    if (request.status !== 'PENDING' && request.status !== 'ASSIGNED') {
      return res.status(400).json({
        error: 'Cannot cancel request with current status'
      });
    }

    await request.update({ status: 'CANCELLED' });

    res.json({
      success: true,
      message: 'Session request cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

// Admin cancel session with calendar update
router.put('/:id/admin-cancel', authenticate, requireAdmin, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const request = await SessionRequest.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone', 'googleCalendarConnected',
                       'googleAccessToken', 'googleRefreshToken', 'googleTokenExpiry', 'googleEmail']
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'name', 'email', 'phone', 'googleCalendarConnected',
                       'googleAccessToken', 'googleRefreshToken', 'googleTokenExpiry', 'googleEmail']
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ error: 'Session request not found' });
    }

    // Update calendar events if they exist
    if ((request.tutorCalendarEventId || request.studentCalendarEventId) && request.tutor && request.student) {
      try {
        // Prepare cancellation update for calendar events
        const calendarUpdate = {
          summary: `[CANCELLED] ${request.subject}`,
          description: `This session has been cancelled by the administrator.\n\nReason: ${cancellationReason || 'No reason provided'}\n\n--- Original Description ---\n${request.description || ''}`,
          status: 'cancelled'
        };

        const eventIds = {
          tutorEventId: request.tutorCalendarEventId,
          studentEventId: request.studentCalendarEventId
        };

        // Update both calendar events
        const updateResults = await calendarService.updateSessionCalendarEvents(
          request.tutor,
          request.student,
          eventIds,
          calendarUpdate
        );

        console.log('Calendar events updated for cancellation:', updateResults);
      } catch (calendarError) {
        console.error('Failed to update calendar events for cancellation:', calendarError);
        // Continue with cancellation even if calendar update fails
      }
    }

    // Update the request status
    await request.update({
      status: 'CANCELLED',
      adminNotes: cancellationReason ? `Cancelled by admin: ${cancellationReason}` : 'Cancelled by admin'
    });

    const updatedRequest = await SessionRequest.findByPk(request.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Session cancelled successfully and calendar events updated',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error cancelling session:', error);
    res.status(500).json({ error: 'Failed to cancel session' });
  }
});

module.exports = router;