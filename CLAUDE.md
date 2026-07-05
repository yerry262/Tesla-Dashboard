# Torque Board - Tesla Dashboard

## Project Overview

A comprehensive React.js and Node.js dashboard for monitoring and controlling Tesla vehicles using the Tesla Fleet API. Real-time vehicle data, trip analytics, charging monitoring, and remote vehicle control from a single interface.

## Features

- **Real-Time Monitoring**: Live vehicle status and telemetry
- **Trip Analytics**: Distance, speed, efficiency tracking
- **Charging Management**: Charge status, scheduling, and optimization
- **Remote Control**: Lock/unlock, climate control, precondition
- **Trip History**: Historical trip data and trends
- **Energy Monitoring**: Battery health, efficiency metrics
- **Multi-Vehicle**: Support for multiple Tesla vehicles
- **Responsive Design**: Desktop and mobile optimization

## Architecture

### Frontend (React.js)
- Dashboard with vehicle cards and metrics
- Real-time data visualization
- Control panels for vehicle functions
- Trip history and analytics views
- Settings and preferences

### Backend (Node.js)
- Tesla Fleet API integration
- Data caching and optimization
- WebSocket for real-time updates
- Trip data processing and storage
- Authentication and security

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB or PostgreSQL for trip history
- **Real-Time**: WebSocket for live vehicle data
- **Tesla API**: Fleet API integration
- **Styling**: Tailwind CSS or Material-UI
- **Deployment**: GitHub Pages (frontend) + hosted backend

## Deployment Status

- **GitHub**: [yerry262/Tesla-Dashboard](https://github.com/yerry262/Tesla-Dashboard)
- **Package Name**: tesla-dashboard
- **API**: Tesla Fleet API

## Setup

### Installation

```bash
# Backend
cd backend
npm install
# Add Tesla API credentials to .env
npm start

# Frontend
cd frontend
npm install
npm run dev
```

### Tesla Fleet API Setup

1. Create Tesla developer account at [developer.tesla.com](https://developer.tesla.com)
2. Register your application
3. Generate API tokens
4. Add to environment variables:
   ```env
   TESLA_CLIENT_ID=your_id
   TESLA_CLIENT_SECRET=your_secret
   TESLA_ACCESS_TOKEN=your_token
   ```

## Dashboard Sections

### Vehicle Status
- Charge level and range
- Location and trip status
- Climate and door status
- Odometer reading

### Charging
- Current charge status
- Charging history
- Recommended charge times
- Energy cost estimates

### Trips
- Current trip details
- Historical trips
- Distance and efficiency
- Route information

### Controls
- Lock/unlock doors
- Climate control (heat/cool)
- Preconditioning for cold weather
- Seat heaters/coolers
- Sunroof control

### Analytics
- Trip efficiency trends
- Monthly energy usage
- Charging patterns
- Driving habits summary

## API Endpoints

```
GET    /api/vehicle/:id         - Get vehicle status
GET    /api/vehicle/:id/trips   - Get trip history
POST   /api/vehicle/:id/lock    - Lock vehicle
POST   /api/vehicle/:id/unlock  - Unlock vehicle
POST   /api/vehicle/:id/climate - Set climate
GET    /api/vehicle/:id/charge  - Get charging status
```

## Real-Time Features

- Live battery percentage and range
- Trip distance and speed
- Climate mode changes
- Door lock status
- Charging state transitions

## Data Visualization

- Battery level gauges
- Range and efficiency charts
- Trip maps with route visualization
- Historical energy usage graphs
- Charging session timeline

## Code Style

- Functional React components with hooks
- Express middleware for API structure
- Clean separation of concerns
- Error handling for Tesla API delays
- Responsive design patterns

## Known Limitations

- Tesla Fleet API rate limits apply
- Real-time updates depend on vehicle wake state
- Historical data limited by Tesla retention
- Some vehicles may not support all features
- Sentry (security) mode disables certain controls

## Troubleshooting

- **Vehicle offline**: Tap the Tesla app to wake vehicle
- **Auth errors**: Check token validity and expiration
- **Slow updates**: Tesla API may have delays in poor connectivity
- **Missing data**: Some metrics require recent trips/charges

## Future Enhancements

- Mobile app version (React Native)
- Predictive charging optimization
- Multi-vehicle comparison
- Advanced trip analytics (acceleration, braking)
- Integration with other vehicle brands
- Supercharger availability checking
- Trip cost calculations
- Calendar-based scheduling

## Security

- Never commit API keys or tokens
- Use environment variables for credentials
- Secure WebSocket connections (WSS)
- Token refresh on expiration
- User authentication required

## Last Updated

2026-07-05
