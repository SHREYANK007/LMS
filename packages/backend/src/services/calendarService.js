const googleOAuthService = require('./googleOAuthService');
const { getValidTokens } = require('../controllers/googleOAuthController');

class CalendarService {
  /**
   * Create calendar events for both tutor and student
   * @param {Object} tutor - Tutor user object with Google credentials
   * @param {Object} student - Student user object with Google credentials
   * @param {Object} sessionDetails - Session details for the event
   * @returns {Object} Results of calendar event creation
   */
  async createSessionCalendarEvents(tutor, student, sessionDetails) {
    const results = {
      tutorEvent: null,
      studentEvent: null,
      meetLink: null,
      errors: []
    };

    const eventDetails = {
      title: sessionDetails.title || `1-on-1 Session: ${sessionDetails.subject}`,
      description: sessionDetails.description || this.generateEventDescription(sessionDetails, tutor, student),
      startTime: sessionDetails.startTime,
      endTime: sessionDetails.endTime,
      attendees: []
    };

    // Add both participants as attendees
    const attendees = [];
    if (tutor.googleEmail) {
      attendees.push({ email: tutor.googleEmail });
    } else if (tutor.email) {
      attendees.push({ email: tutor.email });
    }

    if (student.googleEmail) {
      attendees.push({ email: student.googleEmail });
    } else if (student.email) {
      attendees.push({ email: student.email });
    }

    // Create event in tutor's calendar if connected
    if (tutor.googleCalendarConnected) {
      try {
        console.log('Creating calendar event for tutor:', tutor.name || tutor.email);
        const tutorTokens = await getValidTokens(tutor);

        // Include student as attendee
        const tutorEventDetails = {
          ...eventDetails,
          attendees: student.email ? [{ email: student.googleEmail || student.email }] : []
        };

        const tutorEvent = await googleOAuthService.createCalendarEvent(tutorTokens, tutorEventDetails);
        results.tutorEvent = tutorEvent;
        results.meetLink = tutorEvent.meetLink; // Primary Meet link from tutor's event

        console.log('Tutor calendar event created:', tutorEvent.eventId);
      } catch (error) {
        console.error('Failed to create tutor calendar event:', error);
        results.errors.push({
          type: 'tutor',
          message: error.message
        });
      }
    } else {
      console.log('Tutor does not have calendar connected');
    }

    // Create event in student's calendar if connected
    if (student.googleCalendarConnected) {
      try {
        console.log('Creating calendar event for student:', student.name || student.email);
        const studentTokens = await getValidTokens(student);

        // If we already have a Meet link from tutor's event, use it
        // Otherwise create a new one
        const studentEventDetails = {
          ...eventDetails,
          attendees: tutor.email ? [{ email: tutor.googleEmail || tutor.email }] : []
        };

        // If tutor's event was created with a Meet link, add it to description
        if (results.meetLink) {
          studentEventDetails.description += `\n\nGoogle Meet Link: ${results.meetLink}`;
        }

        const studentEvent = await googleOAuthService.createCalendarEvent(studentTokens, studentEventDetails);
        results.studentEvent = studentEvent;

        // If we didn't get a Meet link from tutor, use student's
        if (!results.meetLink && studentEvent.meetLink) {
          results.meetLink = studentEvent.meetLink;
        }

        console.log('Student calendar event created:', studentEvent.eventId);
      } catch (error) {
        console.error('Failed to create student calendar event:', error);
        results.errors.push({
          type: 'student',
          message: error.message
        });
      }
    } else {
      console.log('Student does not have calendar connected');
    }

    // If neither has calendar connected but we need to create a Meet link
    // This would require a service account or admin calendar
    if (!results.tutorEvent && !results.studentEvent) {
      console.log('Neither tutor nor student has calendar connected');
      // In production, you might want to use a service account here
      // to create events and Meet links
    }

    return results;
  }

  /**
   * Generate a detailed event description
   */
  generateEventDescription(sessionDetails, tutor, student) {
    return `One-to-one tutoring session

Subject: ${sessionDetails.subject}
Student: ${student.name || student.email}
Tutor: ${tutor.name || tutor.email}

${sessionDetails.description || 'No additional description provided'}

This event was automatically scheduled through the LMS platform.`;
  }

  /**
   * Update calendar events for both participants
   */
  async updateSessionCalendarEvents(tutor, student, eventIds, updates) {
    const results = {
      tutorUpdated: false,
      studentUpdated: false,
      errors: []
    };

    // Update tutor's event
    if (tutor.googleCalendarConnected && eventIds.tutorEventId) {
      try {
        const tutorTokens = await getValidTokens(tutor);
        await googleOAuthService.updateCalendarEvent(
          tutorTokens,
          eventIds.tutorEventId,
          updates
        );
        results.tutorUpdated = true;
      } catch (error) {
        console.error('Failed to update tutor calendar event:', error);
        results.errors.push({
          type: 'tutor',
          message: error.message
        });
      }
    }

    // Update student's event
    if (student.googleCalendarConnected && eventIds.studentEventId) {
      try {
        const studentTokens = await getValidTokens(student);
        await googleOAuthService.updateCalendarEvent(
          studentTokens,
          eventIds.studentEventId,
          updates
        );
        results.studentUpdated = true;
      } catch (error) {
        console.error('Failed to update student calendar event:', error);
        results.errors.push({
          type: 'student',
          message: error.message
        });
      }
    }

    return results;
  }

  /**
   * Delete calendar events for both participants
   */
  async deleteSessionCalendarEvents(tutor, student, eventIds) {
    const results = {
      tutorDeleted: false,
      studentDeleted: false,
      errors: []
    };

    // Delete tutor's event
    if (tutor.googleCalendarConnected && eventIds.tutorEventId) {
      try {
        const tutorTokens = await getValidTokens(tutor);
        await googleOAuthService.deleteCalendarEvent(
          tutorTokens,
          eventIds.tutorEventId
        );
        results.tutorDeleted = true;
      } catch (error) {
        console.error('Failed to delete tutor calendar event:', error);
        results.errors.push({
          type: 'tutor',
          message: error.message
        });
      }
    }

    // Delete student's event
    if (student.googleCalendarConnected && eventIds.studentEventId) {
      try {
        const studentTokens = await getValidTokens(student);
        await googleOAuthService.deleteCalendarEvent(
          studentTokens,
          eventIds.studentEventId
        );
        results.studentDeleted = true;
      } catch (error) {
        console.error('Failed to delete student calendar event:', error);
        results.errors.push({
          type: 'student',
          message: error.message
        });
      }
    }

    return results;
  }
}

module.exports = new CalendarService();