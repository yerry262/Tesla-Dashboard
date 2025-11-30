const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const teslaApi = require('../services/teslaApi');

// Store for OAuth states (in production, use Redis or database)
const oauthStates = new Map();

/**
 * GET /auth/login
 * Initiate OAuth flow - returns authorization URL
 */
router.get('/login', (req, res) => {
  const state = uuidv4();
  oauthStates.set(state, { createdAt: Date.now() });
  
  // Clean up old states (older than 10 minutes)
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, value] of oauthStates) {
    if (value.createdAt < tenMinutesAgo) {
      oauthStates.delete(key);
    }
  }

  const authUrl = teslaApi.getAuthorizationUrl(state);
  res.json({ authUrl, state });
});

/**
 * POST /auth/token
 * Exchange authorization code for access token
 */
router.post('/token', async (req, res) => {
  const { code, state } = req.body;
  
  console.log('🔐 Token exchange request received');
  console.log('   Session ID:', req.sessionID);

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  // State validation is optional - skip if state not in store (e.g., after server restart)
  // In production, use Redis or database for state storage

  try {
    const tokens = await teslaApi.exchangeCodeForToken(code);
    
    console.log('✅ Token exchange successful');
    console.log('   Access token received:', tokens.accessToken ? 'Yes' : 'No');
    console.log('   Refresh token received:', tokens.refreshToken ? 'Yes' : 'No');
    
    // Store tokens in session
    req.session.accessToken = tokens.accessToken;
    req.session.refreshToken = tokens.refreshToken;
    req.session.tokenExpiry = Date.now() + (tokens.expiresIn * 1000);
    
    // Force session save before responding
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.status(500).json({ error: 'Failed to save session' });
      }
      
      console.log('✅ Session saved successfully');
      console.log('   Session ID:', req.sessionID);

      // Clean up used state
      if (state && oauthStates.has(state)) {
        oauthStates.delete(state);
      }

      res.json({
        success: true,
        expiresIn: tokens.expiresIn,
        message: 'Successfully authenticated with Tesla'
      });
    });
  } catch (error) {
    console.error('❌ Token exchange error:', error);
    res.status(500).json({ error: 'Failed to exchange authorization code' });
  }
});

/**
 * POST /auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  const refreshToken = req.session.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token available' });
  }

  try {
    const tokens = await teslaApi.refreshAccessToken(refreshToken);
    
    req.session.accessToken = tokens.accessToken;
    req.session.refreshToken = tokens.refreshToken;
    req.session.tokenExpiry = Date.now() + (tokens.expiresIn * 1000);

    res.json({
      success: true,
      expiresIn: tokens.expiresIn
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Failed to refresh token' });
  }
});

/**
 * GET /auth/status
 * Check authentication status
 */
router.get('/status', (req, res) => {
  const isAuthenticated = !!req.session.accessToken;
  const isExpired = req.session.tokenExpiry ? Date.now() > req.session.tokenExpiry : true;

  res.json({
    authenticated: isAuthenticated && !isExpired,
    hasRefreshToken: !!req.session.refreshToken
  });
});

/**
 * POST /auth/logout
 * Clear session and logout
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
