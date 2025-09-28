const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  initiateOAuth,
  handleOAuthCallback,
  getConnectionStatus,
  disconnectCalendar
} = require('../controllers/googleOAuthController');

// Routes for Google Calendar OAuth
router.get('/connect', authenticate, authorize('TUTOR', 'STUDENT'), initiateOAuth);
router.get('/callback', handleOAuthCallback); // No auth needed for OAuth callback
router.get('/status', authenticate, authorize('TUTOR', 'STUDENT'), getConnectionStatus);
router.post('/disconnect', authenticate, authorize('TUTOR', 'STUDENT'), disconnectCalendar);

module.exports = router;