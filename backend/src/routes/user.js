const express = require('express');
const router = express.Router();
const teslaApi = require('../services/teslaApi');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const result = await teslaApi.getMe(req.session.accessToken);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Get user feature config
router.get('/feature-config', async (req, res) => {
  try {
    const result = await teslaApi.getFeatureConfig(req.session.accessToken);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Get user orders
router.get('/orders', async (req, res) => {
  try {
    const result = await teslaApi.getOrders(req.session.accessToken);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Get user region
router.get('/region', async (req, res) => {
  try {
    const result = await teslaApi.getRegion(req.session.accessToken);
    res.json(result);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = router;
