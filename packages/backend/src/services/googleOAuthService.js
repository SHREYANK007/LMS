const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

class GoogleOAuthService {
  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback'
    );

    this.scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];
  }

  /**
   * Generate OAuth URL for user consent
   */
  getAuthUrl(userId) {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      prompt: 'consent',
      state: userId // Pass user ID to link tokens with user
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error('Failed to exchange authorization code');
    }
  }

  /**
   * Set credentials for API calls
   */
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Refresh access token if expired
   */
  async refreshAccessToken(refreshToken) {
    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      return credentials;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Create calendar event for user
   */
  async createCalendarEvent(tokens, eventDetails) {
    try {
      // Set user's tokens
      this.oauth2Client.setCredentials(tokens);

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const event = {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.startTime,
          timeZone: eventDetails.timeZone || 'America/New_York',
        },
        end: {
          dateTime: eventDetails.endTime,
          timeZone: eventDetails.timeZone || 'America/New_York',
        },
        conferenceData: {
          createRequest: {
            requestId: `lms-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        attendees: eventDetails.attendees || [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendNotifications: true
      });

      return {
        eventId: response.data.id,
        htmlLink: response.data.htmlLink,
        meetLink: response.data.hangoutLink,
        status: response.data.status
      };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  /**
   * Get user's calendar events
   */
  async getCalendarEvents(tokens, timeMin, timeMax) {
    try {
      this.oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  /**
   * Delete calendar event
   */
  async deleteCalendarEvent(tokens, eventId) {
    try {
      this.oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendNotifications: true
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  /**
   * Update calendar event
   */
  async updateCalendarEvent(tokens, eventId, updates) {
    try {
      this.oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const response = await calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        resource: updates,
        sendNotifications: true
      });

      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  /**
   * Get user profile from Google
   */
  async getUserProfile(tokens) {
    try {
      this.oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });

      const response = await oauth2.userinfo.get();
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }
}

module.exports = new GoogleOAuthService();