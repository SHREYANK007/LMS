# Session Cancellation Feature

## Overview
Administrators can now cancel one-to-one sessions at any time, and the cancellation will automatically update Google Calendar events for both the tutor and student.

## Features Implemented

### 1. Backend API Endpoint
- **Endpoint**: `PUT /session-requests/:id/admin-cancel`
- **Authorization**: Admin only
- **Functionality**:
  - Updates session status to "CANCELLED"
  - Modifies Google Calendar events for both participants
  - Stores cancellation reason in admin notes
  - Handles calendar API failures gracefully

### 2. Calendar Integration
When a session is cancelled:
- **Event Title**: Updated to `[CANCELLED] {original title}`
- **Event Description**: Includes cancellation reason and marks as cancelled by admin
- **Event Status**: Set to "cancelled" in Google Calendar
- **Visual Indicator**: Events appear with strikethrough in most calendar apps

### 3. Admin UI Improvements

#### Cancellation Modal
- Professional modal interface for cancellation
- Required cancellation reason field
- Shows session details before cancellation
- Warning messages about impact
- Visual indicators (red color scheme, warning icons)

#### Cancel Buttons
- Available for sessions with status "ASSIGNED" or "APPROVED"
- Red styling to indicate destructive action
- Appears alongside other action buttons

#### Status Display
- Cancelled sessions show with red background and strikethrough text
- Cancellation reason displayed in admin notes
- Clear "❌ Session Cancelled" indicator

### 4. Student & Tutor Views
- Cancelled sessions display with appropriate styling
- Shows cancellation reason if provided
- Google Meet links remain visible but session marked as cancelled
- Calendar events updated automatically

## How It Works

### Admin Workflow:
1. Admin views session requests in dashboard
2. Clicks "Cancel" button on any assigned or approved session
3. Modal opens requesting cancellation reason
4. Admin provides reason and confirms
5. System updates:
   - Database session status to "CANCELLED"
   - Both Google Calendar events (if they exist)
   - UI refreshes to show cancelled status

### Technical Process:
```javascript
1. Admin triggers cancellation
2. Frontend calls: api.adminCancelSessionRequest(requestId, reason)
3. Backend:
   - Fetches session with tutor and student details
   - Updates Google Calendar events via calendarService
   - Updates database record
   - Returns success response
4. Frontend shows success message and refreshes
```

### Calendar Update Process:
```javascript
// Calendar event modifications:
{
  summary: "[CANCELLED] Original Session Title",
  description: "This session has been cancelled by the administrator.\n\nReason: {reason}",
  status: "cancelled"
}
```

## Error Handling

### Graceful Failures:
- If calendar update fails, session still gets cancelled in database
- Error logged but doesn't block the cancellation
- Admin notified if calendar update fails

### Validation:
- Cancellation reason is required
- Only sessions with appropriate status can be cancelled
- Only admins can access the cancellation endpoint

## UI Components

### CancelSessionModal
Location: `/components/admin/CancelSessionModal.js`
- Reusable modal component
- Shows session details
- Requires cancellation reason
- Professional styling with warnings

### Status Colors:
- **PENDING**: Yellow (awaiting action)
- **ASSIGNED**: Blue (tutor assigned)
- **APPROVED**: Green (ready to go)
- **REJECTED**: Red (declined)
- **CANCELLED**: Red with strikethrough (cancelled by admin)

## Database Changes
- Session status updated to "CANCELLED"
- Admin notes include: `"Cancelled by admin: {reason}"`
- Calendar event IDs remain for reference
- Timestamps preserved for audit trail

## Testing the Feature

### Prerequisites:
1. Admin account access
2. At least one assigned/approved session
3. Tutor and/or student with Google Calendar connected

### Test Steps:
1. Login as admin
2. Navigate to Session Requests
3. Find an assigned or approved session
4. Click "Cancel" button
5. Enter cancellation reason
6. Confirm cancellation
7. Verify:
   - Session shows as cancelled
   - Calendar events updated (check tutor/student calendars)
   - Cancellation reason displayed

### Expected Results:
- ✅ Session status changes to "CANCELLED"
- ✅ Modal provides clear feedback
- ✅ Google Calendar events show "[CANCELLED]" prefix
- ✅ Both participants see updated status
- ✅ Cancellation reason preserved

## Security Considerations
- Only admins can cancel sessions
- JWT authentication required
- Cancellation reasons logged for accountability
- Original session data preserved
- Calendar tokens handled securely

## Future Enhancements
1. Email notifications to participants
2. Bulk cancellation for multiple sessions
3. Automatic refund processing integration
4. Cancellation analytics dashboard
5. Undo cancellation within time window

## API Reference

### Request:
```http
PUT /session-requests/:id/admin-cancel
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "cancellationReason": "Tutor unavailable due to emergency"
}
```

### Response:
```json
{
  "success": true,
  "message": "Session cancelled successfully and calendar events updated",
  "request": {
    "id": "session-id",
    "status": "CANCELLED",
    "adminNotes": "Cancelled by admin: Tutor unavailable due to emergency",
    ...
  }
}
```

## Troubleshooting

### Common Issues:

1. **Calendar events not updating**
   - Check if tutor/student have calendar connected
   - Verify Google API credentials
   - Check console logs for specific errors

2. **Cancel button not appearing**
   - Ensure session status is ASSIGNED or APPROVED
   - Verify admin role authentication

3. **Modal not opening**
   - Check browser console for JavaScript errors
   - Ensure CancelSessionModal component imported correctly

4. **Cancellation fails**
   - Verify backend server is running
   - Check network requests in browser DevTools
   - Ensure proper authentication token