require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const { bootstrapAdmin, bootstrapFeatures } = require('./utils/bootstrap');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const sessionRoutes = require('./routes/sessions');
const smartQuadRoutes = require('./routes/smartQuad');
const googleOAuthRoutes = require('./routes/googleOAuth');
const studentRoutes = require('./routes/students');
const tutorRoutes = require('./routes/tutors');
const tutorAppRoutes = require('./routes/tutor');
const userRoutes = require('./routes/user');
const sessionRequestRoutes = require('./routes/sessionRequests');
const materialsRoutes = require('./routes/materials');
const reviewRoutes = require('./routes/reviews');
const announcementRoutes = require('./routes/announcements');
const supportTicketRoutes = require('./routes/supportTickets');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', { ...req.body, password: req.body.password ? '***' : undefined });
  }
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'LMS Backend API',
    status: 'Running',
    endpoints: {
      health: '/health',
      auth: '/auth',
      admin: '/admin',
      sessions: '/sessions',
      supportTickets: '/support-tickets'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/students', studentRoutes);
app.use('/admin/tutors', tutorRoutes);
app.use('/tutor', tutorAppRoutes);
app.use('/sessions', sessionRoutes);
app.use('/smart-quad', smartQuadRoutes);
app.use('/auth/google', googleOAuthRoutes);
app.use('/api', userRoutes);
app.use('/session-requests', sessionRequestRoutes);
app.use('/materials', materialsRoutes);
app.use('/reviews', reviewRoutes);
app.use('/announcements', announcementRoutes);
app.use('/support-tickets', supportTicketRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    await sequelize.sync({ force: false });
    console.log('✓ Database models synchronized');

    await bootstrapAdmin();
    await bootstrapFeatures();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📚 LMS Backend API Ready\n`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();