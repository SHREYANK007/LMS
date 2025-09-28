
# LMS Setup Instructions

## Backend-Frontend Integration Setup

### Prerequisites
- Node.js installed
- PostgreSQL installed and running
- npm or yarn package manager

### Backend Setup (Port 5000)

1. Navigate to backend directory:
```bash
cd packages/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure PostgreSQL:
   - Ensure PostgreSQL is running
   - Update `.env` file with your database credentials:
   ```
   DATABASE_URL=postgres://[username]:[password]@localhost:5432/lms
   ```
   - Default is: `postgres://postgres:postgres@localhost:5432/lms`

4. Create the database:
```sql
CREATE DATABASE lms;
```

5. Start the backend server:
```bash
npm run dev
```

The backend will:
- Connect to PostgreSQL
- Sync database models
- Create an admin account (credentials will be shown in console)
- Run on http://localhost:5000

### Frontend Setup (Port 3000)

1. Navigate to frontend directory:
```bash
cd packages/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Ensure `.env.local` has the correct backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the frontend:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Authentication Flow

### Admin Login
1. When the backend starts, it creates an admin account
2. Check the backend console for admin credentials:
   - Email: admin@lms.com
   - Password: (shown in console or check `.env` file)
3. Login at http://localhost:3000/auth/login

### Creating Users (Admin Only)
1. Login as admin
2. Navigate to Users section in admin panel
3. Click "Create New User"
4. Select role (Student or Tutor)
5. Either generate a random password or set a custom one
6. Share the credentials with the user

### User Roles & Dashboards
- **Admin**: Full system access, user management at `/admin`
- **Tutor**: Teaching tools and schedule at `/tutor`
- **Student**: Learning materials and sessions at `/student`

## Features

### Removed Features
- ❌ Public registration/signup for students and tutors
- ❌ Self-service account creation

### Active Features
- ✅ Admin-only user creation
- ✅ Role-based authentication
- ✅ Protected routes based on user roles
- ✅ Separate dashboards for each role
- ✅ Password reset functionality (admin only)
- ✅ User management interface

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email and password

### Admin (Protected)
- `GET /admin/users` - Get all users (optional role filter)
- `POST /admin/create-user` - Create new user account
- `POST /admin/reset-password/:userId` - Reset user password
- `DELETE /admin/users/:userId` - Delete user account

### Sessions (Protected)
- `GET /sessions` - Get all sessions
- `POST /sessions` - Create new session
- `PUT /sessions/:id` - Update session
- `DELETE /sessions/:id` - Delete session

## Troubleshooting

### Database Connection Error
If you see `role "username" does not exist`:
- Update the `.env` file in backend with correct PostgreSQL credentials
- Common default: `postgres://postgres:postgres@localhost:5432/lms`

### Port Already in Use
- Backend uses port 5000
- Frontend uses port 3000
- Change ports in respective `.env` files if needed

### Admin Password
- Check backend console output when server starts
- Or set `ADMIN_PASSWORD` in backend `.env` file before first run

## Security Notes
- Admin credentials are generated on first run
- All user creation is restricted to admin only
- JWT tokens are used for authentication
- Protected routes enforce role-based access