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
router.get('/connect', authenticate, authorize('TUTOR'), initiateOAuth);
router.get('/callback', handleOAuthCallback); // No auth needed for OAuth callback
router.get('/status', authenticate, authorize('TUTOR'), getConnectionStatus);
router.post('/disconnect', authenticate, authorize('TUTOR'), disconnectCalendar);

module.exports = router;