const googleOAuthService = require('../services/googleOAuthService');
const { User } = require('../models');

/**
 * Start Google OAuth flow
 */
const initiateOAuth = async (req, res) => {
  try {
    const userId = req.user.id;
    const authUrl = googleOAuthService.getAuthUrl(userId);

    res.json({
      success: true,
      authUrl,
      message: 'Visit this URL to authorize Google Calendar access'
    });
  } catch (error) {
    console.error('Error initiating OAuth:', error);
    res.status(500).json({
      error: 'Failed to initiate Google authorization'
    });
  }
};

/**
 * Handle OAuth callback
 */
const handleOAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        error: 'Authorization code is required'
      });
    }

    // Get tokens from authorization code
    const tokens = await googleOAuthService.getTokensFromCode(code);

    // Get user profile to verify the connection
    const userProfile = await googleOAuthService.getUserProfile(tokens);

    // Find user by state parameter (user ID)
    const user = await User.findByPk(state);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Store tokens in database
    await user.update({
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
      googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      googleCalendarConnected: true,
      googleEmail: userProfile.email
    });

    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/tutor/calendar-connected?success=true`);
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/tutor/calendar-connected?error=true`);
  }
};

/**
 * Check calendar connection status
 */
const getConnectionStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['googleCalendarConnected', 'googleEmail']
    });

    res.json({
      success: true,
      connected: user.googleCalendarConnected,
      email: user.googleEmail
    });
  } catch (error) {
    console.error('Error checking connection status:', error);
    res.status(500).json({
      error: 'Failed to check calendar connection status'
    });
  }
};

/**
 * Disconnect Google Calendar
 */
const disconnectCalendar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    await user.update({
      googleAccessToken: null,
      googleRefreshToken: null,
      googleTokenExpiry: null,
      googleCalendarConnected: false,
      googleEmail: null
    });

    res.json({
      success: true,
      message: 'Google Calendar disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    res.status(500).json({
      error: 'Failed to disconnect Google Calendar'
    });
  }
};

/**
 * Get user's valid tokens (refresh if needed)
 */
const getValidTokens = async (user) => {
  const now = new Date();
  const tokens = {
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleTokenExpiry
  };

  // Check if token is expired
  if (user.googleTokenExpiry && now >= user.googleTokenExpiry) {
    try {
      const refreshedTokens = await googleOAuthService.refreshAccessToken(user.googleRefreshToken);

      // Update tokens in database
      await user.update({
        googleAccessToken: refreshedTokens.access_token,
        googleTokenExpiry: refreshedTokens.expiry_date ? new Date(refreshedTokens.expiry_date) : null
      });

      return {
        access_token: refreshedTokens.access_token,
        refresh_token: user.googleRefreshToken,
        expiry_date: refreshedTokens.expiry_date
      };
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  return tokens;
};

module.exports = {
  initiateOAuth,
  handleOAuthCallback,
  getConnectionStatus,
  disconnectCalendar,
  getValidTokens
};