const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = null;
    this.calendar = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      // Set credentials if they exist
      if (process.env.GOOGLE_ACCESS_TOKEN && process.env.GOOGLE_REFRESH_TOKEN) {
        this.oauth2Client.setCredentials({
          access_token: process.env.GOOGLE_ACCESS_TOKEN,
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
          scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
          token_type: 'Bearer'
        });
      }

      this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    } catch (error) {
      console.error('Google Calendar initialization error:', error);
    }
  }

  // Generate OAuth URL for initial setup
  generateAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Exchange authorization code for tokens
  async getTokenFromCode(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date
      };
    } catch (error) {
      console.error('Error getting tokens from code:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
      return credentials;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  // Create a Smart Quad session event
  async createSmartQuadSession({
    title,
    description,
    startTime,
    endTime,
    tutorEmail,
    courseType,
    sessionType = 'Smart Quad'
  }) {
    try {
      // Ensure we have valid credentials
      if (!this.oauth2Client.credentials.access_token) {
        throw new Error('No valid Google Calendar credentials available');
      }

      // Create unique conference ID for Google Meet
      const conferenceId = uuidv4();

      const event = {
        summary: `${sessionType}: ${title}`,
        description: `Course Type: ${courseType}\nSession Type: ${sessionType}\nTutor: ${tutorEmail}\n\n${description || 'Smart Quad learning session'}`,
        start: {
          dateTime: new Date(startTime).toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(endTime).toISOString(),
          timeZone: 'UTC',
        },
        conferenceData: {
          createRequest: {
            requestId: conferenceId,
            conferenceSolution: {
              key: {
                type: 'hangoutsMeet'
              }
            }
          }
        },
        attendees: [
          {
            email: tutorEmail,
            responseStatus: 'accepted'
          }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 }, // 1 hour before
            { method: 'popup', minutes: 10 }  // 10 minutes before
          ]
        },
        visibility: 'private',
        status: 'confirmed'
      };

      // Create the event
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      });

      console.log('Google Calendar event created:', response.data.id);

      return {
        eventId: response.data.id,
        meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || response.data.hangoutLink,
        calendarEventUrl: response.data.htmlLink,
        eventDetails: {
          id: response.data.id,
          summary: response.data.summary,
          start: response.data.start.dateTime,
          end: response.data.end.dateTime,
          meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || response.data.hangoutLink
        }
      };

    } catch (error) {
      console.error('Error creating Google Calendar event:', error);

      // Handle token refresh if needed
      if (error.code === 401) {
        try {
          console.log('Access token expired, attempting refresh...');
          await this.refreshAccessToken();
          // Retry the request
          return await this.createSmartQuadSession({
            title, description, startTime, endTime, tutorEmail, courseType, sessionType
          });
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          throw new Error('Google Calendar authentication failed. Please re-authenticate.');
        }
      }

      throw error;
    }
  }

  // Update an existing calendar event
  async updateCalendarEvent(eventId, updates) {
    try {
      const response = await this.calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        resource: updates
      });

      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  // Delete a calendar event
  async deleteCalendarEvent(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });

      console.log('Calendar event deleted:', eventId);
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  // Get calendar events for a date range
  async getCalendarEvents(startTime, endTime) {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date(startTime).toISOString(),
        timeMax: new Date(endTime).toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  // Check if service is properly configured
  isConfigured() {
    return !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REDIRECT_URI &&
      this.oauth2Client.credentials.access_token
    );
  }
}

module.exports = new GoogleCalendarService();