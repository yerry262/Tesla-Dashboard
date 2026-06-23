require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const chargingRoutes = require('./routes/charging');
const commandRoutes = require('./routes/commands');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3034;
const isProduction = process.env.NODE_ENV === 'production';

console.log('🚀 Starting server with config:', {
  PORT,
  NODE_ENV: process.env.NODE_ENV,
  isProduction,
  FRONTEND_URL: process.env.FRONTEND_URL,
  TESLA_REDIRECT_URI: process.env.TESLA_REDIRECT_URI
});

// Validate required env vars early so Railway logs make the issue obvious
const requiredEnvVars = ['TESLA_CLIENT_ID', 'TESLA_CLIENT_SECRET', 'TESLA_REDIRECT_URI'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error('❌ MISSING REQUIRED ENV VARS:', missingVars.join(', '));
  console.error('   Auth will fail until these are set in Railway.');
} else {
  console.log('✅ All required Tesla env vars are set');
  console.log('   TESLA_REDIRECT_URI:', process.env.TESLA_REDIRECT_URI);
}

// Allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3033',
  'https://yerry262.github.io'
].filter(Boolean);

console.log('📋 Allowed CORS origins:', allowedOrigins);

// Middleware
app.use(express.json());

// Trust proxy for Railway (required for secure cookies behind proxy)
if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'tesla-dashboard-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, // true in production (HTTPS required)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? 'none' : 'lax' // 'none' required for cross-origin in production
  }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/charging', chargingRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Note: OAuth callback is now handled directly by the frontend at /callback

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
