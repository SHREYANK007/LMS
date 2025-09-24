# LMS Backend API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login
`POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "admin@lms.com",
  "password": "yourpassword"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@lms.com",
    "role": "ADMIN"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## Admin Endpoints (Requires ADMIN role)

### Get All Users
`GET /admin/users`

**Query Parameters:**
- `role` (optional): Filter by role (ADMIN, TUTOR, STUDENT)

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "tutor@lms.com",
      "role": "TUTOR",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create User
`POST /admin/create-user`

**Request Body:**
```json
{
  "email": "newtutor@lms.com",
  "role": "TUTOR",
  "password": "optionalPassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "email": "newtutor@lms.com",
    "role": "TUTOR"
  },
  "generatedPassword": "xK9#mP2$vL6@nQ4!"
}
```

**Note:** If password is not provided, a random password will be generated and returned in the response.

### Reset User Password
`POST /admin/reset-password/:userId`

**Request Body (optional):**
```json
{
  "password": "newPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "generatedPassword": "zT7&wE3#qR9$mN1!"
}
```

### Delete User
`DELETE /admin/users/:userId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Session Endpoints

### Create Session (TUTOR, ADMIN only)
`POST /sessions`

**Request Body:**
```json
{
  "title": "Mathematics Tutorial - Algebra",
  "description": "Introduction to algebraic equations",
  "startTime": "2024-01-20T14:00:00Z",
  "endTime": "2024-01-20T15:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "session": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "title": "Mathematics Tutorial - Algebra",
    "description": "Introduction to algebraic equations",
    "tutorId": "550e8400-e29b-41d4-a716-446655440000",
    "eventId": "google_event_id_123",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "startTime": "2024-01-20T14:00:00Z",
    "endTime": "2024-01-20T15:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "tutor": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "tutor@lms.com",
      "role": "TUTOR"
    }
  }
}
```

### Get Today's Sessions (All authenticated users)
`GET /sessions/today`

**Response (200 OK):**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440002",
      "title": "Mathematics Tutorial - Algebra",
      "description": "Introduction to algebraic equations",
      "tutorId": "550e8400-e29b-41d4-a716-446655440000",
      "eventId": "google_event_id_123",
      "meetLink": "https://meet.google.com/abc-defg-hij",
      "startTime": "2024-01-20T14:00:00Z",
      "endTime": "2024-01-20T15:00:00Z",
      "tutor": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "tutor@lms.com",
        "role": "TUTOR"
      }
    }
  ]
}
```

### Get All Sessions (All authenticated users)
`GET /sessions`

**Query Parameters:**
- `tutorId` (optional): Filter by tutor ID
- `upcoming` (optional): Set to "true" to get only future sessions

**Response (200 OK):**
```json
{
  "success": true,
  "sessions": [...]
}
```

### Get Session by ID (All authenticated users)
`GET /sessions/:sessionId`

**Response (200 OK):**
```json
{
  "success": true,
  "session": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "title": "Mathematics Tutorial - Algebra",
    "description": "Introduction to algebraic equations",
    "tutorId": "550e8400-e29b-41d4-a716-446655440000",
    "eventId": "google_event_id_123",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "startTime": "2024-01-20T14:00:00Z",
    "endTime": "2024-01-20T15:00:00Z",
    "tutor": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "tutor@lms.com",
      "role": "TUTOR"
    }
  }
}
```

### Update Session (TUTOR, ADMIN only)
`PUT /sessions/:sessionId`

**Request Body (all fields optional):**
```json
{
  "title": "Updated Mathematics Tutorial",
  "description": "Advanced algebraic equations",
  "startTime": "2024-01-20T15:00:00Z",
  "endTime": "2024-01-20T16:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "session": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "title": "Updated Mathematics Tutorial",
    "description": "Advanced algebraic equations",
    "tutorId": "550e8400-e29b-41d4-a716-446655440000",
    "eventId": "google_event_id_123",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "startTime": "2024-01-20T15:00:00Z",
    "endTime": "2024-01-20T16:00:00Z",
    "tutor": {...}
  }
}
```

### Delete Session (TUTOR, ADMIN only)
`DELETE /sessions/:sessionId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Role-Based Access Summary

| Endpoint | ADMIN | TUTOR | STUDENT |
|----------|-------|-------|---------|
| POST /auth/login | ✓ | ✓ | ✓ |
| GET /admin/users | ✓ | ✗ | ✗ |
| POST /admin/create-user | ✓ | ✗ | ✗ |
| POST /admin/reset-password/:id | ✓ | ✗ | ✗ |
| DELETE /admin/users/:id | ✓ | ✗ | ✗ |
| GET /sessions | ✓ | ✓ | ✓ |
| GET /sessions/today | ✓ | ✓ | ✓ |
| GET /sessions/:id | ✓ | ✓ | ✓ |
| POST /sessions | ✓ | ✓ | ✗ |
| PUT /sessions/:id | ✓ | ✓* | ✗ |
| DELETE /sessions/:id | ✓ | ✓* | ✗ |

*Tutors can only update/delete their own sessions

---

## Setup Instructions

1. Install dependencies:
```bash
cd packages/backend
npm install
```

2. Set up PostgreSQL database and update `.env` file

3. Run database migrations:
```bash
npm run migrate
```

4. Start the server:
```bash
npm run dev
```

5. The admin account will be created automatically on first startup. Check console logs for credentials.

---

## Google Calendar Setup

To enable Google Calendar integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/oauth2callback`
6. Update `.env` with your credentials:
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - GOOGLE_REDIRECT_URI

Note: Sessions will be created without Google Calendar integration if not configured, but `meetLink` will be null.