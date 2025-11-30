const express = require('express');
const router = express.Router();
const teslaApi = require('../services/teslaApi');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Check if token is expired
  if (req.session.tokenExpiry && Date.now() > req.session.tokenExpiry) {
    return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
  }
  
  next();
};

/**
 * GET /api/vehicles
 * Get list of all vehicles
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const vehicles = await teslaApi.getVehicles(req.session.accessToken);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Token invalid or expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

/**
 * GET /api/vehicles/:id
 * Get vehicle data by ID
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const vehicleData = await teslaApi.getVehicleData(req.session.accessToken, req.params.id);
    res.json(vehicleData);
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Token invalid or expired', code: 'TOKEN_EXPIRED' });
    }
    if (error.response?.status === 408) {
      return res.status(408).json({ error: 'Vehicle is asleep', code: 'VEHICLE_ASLEEP' });
    }
    res.status(500).json({ error: 'Failed to fetch vehicle data' });
  }
});

/**
 * POST /api/vehicles/:id/wake
 * Wake up a vehicle
 */
router.post('/:id/wake', requireAuth, async (req, res) => {
  try {
    const result = await teslaApi.wakeUpVehicle(req.session.accessToken, req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error waking vehicle:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Token invalid or expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(500).json({ error: 'Failed to wake vehicle' });
  }
});

/**
 * GET /api/vehicles/:id/mobile-enabled
 * Check if mobile access is enabled
 */
router.get('/:id/mobile-enabled', requireAuth, async (req, res) => {
  try {
    const result = await teslaApi.isMobileEnabled(req.session.accessToken, req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error checking mobile enabled:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Token invalid or expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(500).json({ error: 'Failed to check mobile access status' });
  }
});

/**
 * GET /api/vehicles/:id/service
 * Get service data
 */
router.get('/:id/service', requireAuth, async (req, res) => {
  try {
    const result = await teslaApi.getServiceData(req.session.accessToken, req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error fetching service data:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Token invalid or expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(500).json({ error: 'Failed to fetch service data' });
  }
});

/**
 * GET /api/vehicles/:id/release-notes
 * Get firmware release notes
 */
router.get('/:id/release-notes', requireAuth, async (req, res) => {
  try {
    const result = await teslaApi.getReleaseNotes(req.session.accessToken, req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error fetching release notes:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Token invalid or expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(500).json({ error: 'Failed to fetch release notes' });
  }
});

module.exports = router;
