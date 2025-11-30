require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const chargingRoutes = require('./routes/charging');

const app = express();
const PORT = process.env.PORT || 3033;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3033'],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'tesla-dashboard-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/charging', chargingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Tesla OAuth callback route (matches your configured redirect URI)
app.get('/Tesla-Dashboard/callback', (req, res) => {
  const { code, state } = req.query;
  
  if (code) {
    // Redirect to frontend with the authorization code
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/callback?code=${code}&state=${state}`);
  } else {
    res.status(400).json({ error: 'Authorization code not received' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚗 Tesla Dashboard Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
