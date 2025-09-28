# Google Calendar Integration for One-to-One Sessions

## Overview
The system now automatically creates Google Calendar events with Google Meet links when an admin approves and assigns a tutor to a student's one-to-one session request.

## Features
- **Automatic Calendar Event Creation**: When admin assigns a tutor, a calendar event is created in the tutor's Google Calendar
- **Google Meet Integration**: Each event includes a Google Meet link for the virtual session
- **Email Invitations**: Students receive calendar invites if they have provided email addresses
- **Flexible Scheduling**: Admin can override the student's preferred time or use it as default

## Setup Requirements

### 1. Google Cloud Console Setup
1. Create a project in Google Cloud Console
2. Enable the following APIs:
   - Google Calendar API
   - Google OAuth2 API
3. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Add authorized redirect URI: `http://localhost:5001/auth/google/callback` (for development)
   - For production, use your actual domain

### 2. Environment Variables
Add to `packages/backend/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback
```

### 3. Tutor Calendar Connection
Tutors must connect their Google Calendar:
1. Navigate to their profile/settings
2. Click "Connect Google Calendar"
3. Authorize the application to access their calendar
4. The connection status will be saved

## How It Works

### Student Flow:
1. Student requests a one-to-one session with preferred date/time
2. Request appears in admin dashboard
3. Student can view request status and Google Meet link once assigned

### Admin Flow:
1. Admin sees pending session requests
2. Admin assigns a tutor to the request
3. Admin can optionally set a different date/time
4. System automatically:
   - Creates a Google Calendar event in tutor's calendar
   - Generates a Google Meet link
   - Sends calendar invites to participants
   - Saves event details in the database

### Tutor Flow:
1. Tutor must have Google Calendar connected
2. Event appears in their Google Calendar
3. They receive email notification about the session
4. Can join via Google Meet link

## Database Schema
The `session_requests` table includes:
- `calendar_event_id`: Google Calendar event ID
- `meet_link`: Google Meet link for the session
- `calendar_event_link`: Link to view the calendar event
- `scheduled_date_time`: Actual scheduled time (may differ from preferred time)

## API Endpoints

### Assign Tutor with Calendar Event
```
PUT /session-requests/:id/assign
Body: {
  tutorId: "tutor-uuid",
  adminNotes: "optional notes",
  scheduledDateTime: "2024-01-15T14:00:00Z" // optional, uses preferred if not provided
}
```

Response includes:
```json
{
  "success": true,
  "message": "Tutor assigned and calendar event created successfully",
  "request": { ... },
  "calendarEvent": {
    "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
    "calendarLink": "https://calendar.google.com/event?..."
  }
}
```

## Error Handling
- If tutor doesn't have calendar connected, assignment still succeeds but without calendar event
- Calendar creation failures are logged but don't block the assignment
- Token refresh is handled automatically for expired access tokens

## Testing the Integration

1. **Setup Test Accounts**:
   - Create admin, tutor, and student accounts
   - Connect tutor's Google Calendar

2. **Test Session Request Flow**:
   - Login as student and request a session
   - Login as admin and assign the tutor
   - Verify calendar event is created
   - Check Google Meet link is accessible

3. **Verify Email Invitations**:
   - Check that participants receive calendar invites
   - Confirm event appears in tutor's calendar

## Troubleshooting

### Common Issues:
1. **"Failed to create calendar event"**: Check Google API credentials and permissions
2. **No Meet link generated**: Ensure `conferenceDataVersion: 1` is set in the API call
3. **Token expired**: The system should auto-refresh, but tutor may need to reconnect

### Debug Tips:
- Check backend logs for detailed error messages
- Verify environment variables are correctly set
- Ensure database migrations have been run
- Check Google Cloud Console for API usage and errors

## Security Considerations
- OAuth tokens are stored securely in the database
- Refresh tokens are used to maintain long-term access
- Each user's calendar access is isolated
- Admin approval required before calendar events are created