const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const getAuthUrl = () => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};

const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

const createCalendarEvent = async (sessionData) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: sessionData.title,
    description: sessionData.description || '',
    start: {
      dateTime: sessionData.startTime,
      timeZone: 'UTC'
    },
    end: {
      dateTime: sessionData.endTime,
      timeZone: 'UTC'
    },
    conferenceData: {
      createRequest: {
        requestId: `lms-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    },
    attendees: sessionData.attendees || []
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendNotifications: true
    });

    return {
      eventId: response.data.id,
      meetLink: response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri,
      htmlLink: response.data.htmlLink
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
};

const deleteCalendarEvent = async (eventId) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId: eventId
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw new Error('Failed to delete calendar event');
  }
};

const updateCalendarEvent = async (eventId, updateData) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: updateData.title,
    description: updateData.description,
    start: {
      dateTime: updateData.startTime,
      timeZone: 'UTC'
    },
    end: {
      dateTime: updateData.endTime,
      timeZone: 'UTC'
    }
  };

  try {
    const response = await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId: eventId,
      resource: event
    });

    return response.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw new Error('Failed to update calendar event');
  }
};

module.exports = {
  getAuthUrl,
  setCredentials,
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
  oauth2Client
};