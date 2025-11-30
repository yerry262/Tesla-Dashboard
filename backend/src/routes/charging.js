const express = require('express');
const router = express.Router();
const teslaApi = require('../services/teslaApi');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.session.tokenExpiry && Date.now() > req.session.tokenExpiry) {
    return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
  }
  
  next();
};

/**
 * GET /api/charging/:vehicleId/nearby
 * Get nearby charging sites
 */
router.get('/:vehicleId/nearby', requireAuth, async (req, res) => {
  try {
    const chargingSites = await teslaApi.getNearbyChargingSites(
      req.session.accessToken, 
      req.params.vehicleId
    );
    res.json(chargingSites);
  } catch (error) {
    console.error('Error fetching nearby charging sites:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Token invalid or expired', code: 'TOKEN_EXPIRED' });
    }
    if (error.response?.status === 408) {
      return res.status(408).json({ error: 'Vehicle is asleep', code: 'VEHICLE_ASLEEP' });
    }
    res.status(500).json({ error: 'Failed to fetch nearby charging sites' });
  }
});

module.exports = router;
