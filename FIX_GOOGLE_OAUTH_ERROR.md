# Fix Google OAuth Error 400: redirect_uri_mismatch

## The Problem
You're getting "Error 400: redirect_uri_mismatch" because the redirect URI in your Google Cloud Console doesn't match the one your application is using.

## Quick Solution

### Step 1: Go to Google Cloud Console
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if you haven't)
3. Navigate to **APIs & Services** → **Credentials**

### Step 2: Update OAuth 2.0 Client
1. Find your OAuth 2.0 Client ID (should match: `849844153234-3dr9230ncuq9sd90eu3omp9j752hea4p.apps.googleusercontent.com`)
2. Click on it to edit

### Step 3: Add Authorized Redirect URIs
Add ALL of these URIs to handle different scenarios:

**For Local Development:**
```
http://localhost:5001/auth/google/callback
http://localhost:5000/auth/google/callback
http://127.0.0.1:5001/auth/google/callback
http://127.0.0.1:5000/auth/google/callback
```

**If you're using ngrok or a tunnel:**
```
https://your-ngrok-url.ngrok.io/auth/google/callback
```

**For Production (when deployed):**
```
https://yourdomain.com/auth/google/callback
```

### Step 4: Save Changes
1. Click **SAVE** at the bottom
2. Wait 5-10 minutes for changes to propagate (Google needs time to update)

## Verify Your Current Setup

Your application is configured to use:
- **Redirect URI**: `http://localhost:5001/auth/google/callback`
- **Backend Port**: 5001
- **Frontend URL**: `http://localhost:3000`

These are correct for local development.

## Additional Checks

### 1. Enable Required APIs
Make sure these APIs are enabled in Google Cloud Console:
- Google Calendar API
- Google+ API (for OAuth2)
- People API

Go to **APIs & Services** → **Library** and search for each to enable.

### 2. OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Make sure it's configured with:
   - App name: LMS
   - User support email: Your email
   - Scopes include:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`

### 3. Test Mode vs Production
If your app is in "Testing" mode:
- Add test users: Go to OAuth consent screen → Test users → Add users
- Add the email addresses that will be testing (like 2005.monesh@gmail.com)

## Testing the Fix

After updating Google Cloud Console:

1. **Clear browser cache** or use incognito mode
2. **Restart your backend server**:
   ```bash
   cd packages/backend
   npm run dev
   ```
3. **Try the OAuth flow again**:
   - Login as a tutor or student
   - Go to profile/settings
   - Click "Connect Google Calendar"

## Common Issues and Solutions

### Issue 1: Still getting redirect_uri_mismatch
- **Solution**: Make sure you added the EXACT URI including protocol (http vs https), port, and path
- Check for trailing slashes - Google is very strict about exact matches

### Issue 2: "Access blocked: This app's request is invalid"
- **Solution**: Your OAuth consent screen might need verification if you're using sensitive scopes
- For testing, make sure your app is in "Testing" mode and your email is added as a test user

### Issue 3: Different port numbers
- If your backend runs on a different port, update:
  1. `.env` file: `GOOGLE_REDIRECT_URI=http://localhost:YOUR_PORT/auth/google/callback`
  2. Google Cloud Console with the same URI

## Environment Variables Check

Your current `.env` has:
```env
GOOGLE_CLIENT_ID=849844153234-3dr9230ncuq9sd90eu3omp9j752hea4p.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback
```

These should match exactly what's in Google Cloud Console.

## Quick Debug Commands

Check if backend is running on correct port:
```bash
netstat -an | findstr :5001
```

Test the OAuth URL directly:
```
http://localhost:5001/auth/google/connect
```
(You need to be logged in first)

## Need More Help?

If you're still having issues:
1. Check the browser console for the exact redirect_uri being used
2. Check backend logs for the OAuth URL being generated
3. Compare these exactly with what's in Google Cloud Console
4. Remember Google changes can take 5-10 minutes to propagate