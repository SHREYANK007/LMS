# Google Calendar API Setup Instructions

## Issue Found
The Google Calendar API is not enabled for your Google Cloud project (Project ID: 849844153234).

## Steps to Enable Google Calendar API:

1. **Visit the enable link directly:**
   https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=849844153234

2. **Or follow these manual steps:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Select your project (Project ID: 849844153234)
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click on it and press "ENABLE"

3. **Wait for propagation:**
   - After enabling, wait 2-3 minutes for the changes to propagate

4. **Test the integration:**
   - Create a new session from the tutor dashboard
   - Check the backend logs for successful calendar event creation

## What's Working Already:
✅ Session creation in database
✅ Google OAuth authentication
✅ User token storage
✅ Calendar connection status

## What Needs the API Enabled:
❌ Creating Google Calendar events
❌ Generating Google Meet links

## Backend Logs Show:
```
✅ User has Google Calendar connected, attempting to create calendar event
✅ Valid tokens obtained
📅 Creating calendar event with data
❌ Failed to create calendar event: Google Calendar API has not been used in project 849844153234
```

Once you enable the API, the calendar events and Meet links will be created automatically.