# Tesla Dashboard 🚗⚡

A React.js frontend and Node.js backend application to monitor data metrics on your Tesla Model Y using the official Tesla Fleet API.

![Tesla Dashboard](https://img.shields.io/badge/Tesla-Dashboard-red?style=for-the-badge&logo=tesla)

## Features

- 🔋 **Battery Monitoring** - Real-time charge level, range, and charging status
- 📍 **Vehicle Location** - Track your car's location with Google Maps integration
- 🌡️ **Climate Data** - Interior and exterior temperature monitoring
- ⚡ **Charging Info** - Nearby Superchargers with availability
- 🔒 **Vehicle State** - Lock status, doors, trunk, sentry mode
- 📊 **Live Dashboard** - Real-time vehicle data visualization

## Prerequisites

- Node.js 18+ and npm
- Tesla Account with a registered application at [Tesla Developer Portal](https://developer.tesla.com/dashboard)
- Tesla vehicle with Fleet API access enabled

## Project Structure

```
Tesla-Dashboard/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── index.js        # Main server entry
│   │   ├── routes/         # API routes
│   │   │   ├── auth.js     # OAuth authentication
│   │   │   ├── vehicles.js # Vehicle endpoints
│   │   │   └── charging.js # Charging endpoints
│   │   └── services/
│   │       └── teslaApi.js # Tesla Fleet API service
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/               # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   ├── .env.example        # Environment template
│   └── package.json
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yerry262/Tesla-Dashboard.git
cd Tesla-Dashboard
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Tesla API credentials:

```env
TESLA_CLIENT_ID=your_client_id_here
TESLA_CLIENT_SECRET=your_client_secret_here
TESLA_REDIRECT_URI=http://localhost:3033/Tesla-Dashboard/callback
TESLA_API_BASE_URL=https://fleet-api.prd.na.vn.cloud.tesla.com
PORT=3033
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your_random_session_secret
```

Install dependencies and start:

```bash
npm install
npm run dev
```

### 3. Configure Frontend

In a new terminal:

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:3033
REACT_APP_TESLA_CLIENT_ID=your_client_id_here
```

Install dependencies and start:

```bash
npm install
npm start
```

### 4. Access the Dashboard

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tesla API Configuration

Your Tesla Developer Application should be configured with:

### Allowed Origins
- `https://yerry262.github.io/`
- `http://localhost:3033/`

### Redirect URIs
- `https://yerry262.github.io/Tesla-Dashboard/callback`
- `http://localhost:3033/Tesla-Dashboard/callback`

### Required Scopes
- `openid` - Sign in with Tesla
- `offline_access` - Refresh tokens
- `user_data` - Profile information
- `vehicle_device_data` - Vehicle information
- `vehicle_location` - Vehicle location
- `vehicle_cmds` - Vehicle commands
- `vehicle_charging_cmds` - Charging management

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login` | Get Tesla OAuth URL |
| POST | `/auth/token` | Exchange code for token |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/status` | Check auth status |
| POST | `/auth/logout` | Logout |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | List all vehicles |
| GET | `/api/vehicles/:id` | Get vehicle data |
| POST | `/api/vehicles/:id/wake` | Wake up vehicle |
| GET | `/api/vehicles/:id/mobile-enabled` | Check mobile access |
| GET | `/api/vehicles/:id/service` | Get service data |
| GET | `/api/vehicles/:id/release-notes` | Get firmware notes |

### Charging
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/charging/:vehicleId/nearby` | Get nearby Superchargers |

## Regional Base URLs

Select the appropriate Fleet API base URL based on your region:

| Region | Base URL |
|--------|----------|
| North America, Asia-Pacific | `https://fleet-api.prd.na.vn.cloud.tesla.com` |
| Europe, Middle East, Africa | `https://fleet-api.prd.eu.vn.cloud.tesla.com` |
| China | `https://fleet-api.prd.cn.vn.cloud.tesla.cn` |

## Development

### Running in Development Mode

Backend (with hot-reload):
```bash
cd backend && npm run dev
```

Frontend (with hot-reload):
```bash
cd frontend && npm start
```

### Building for Production

```bash
# Build frontend
cd frontend && npm run build

# Start backend in production
cd backend && npm start
```

## Deployment to GitHub Pages

1. Update `REACT_APP_API_URL` in frontend `.env` to your production API URL
2. Build the frontend: `npm run build`
3. Deploy to GitHub Pages

## Security Notes

⚠️ **Important Security Considerations:**

- Never commit your `.env` files to version control
- Keep your `TESLA_CLIENT_SECRET` secure
- The `.gitignore` file is configured to exclude sensitive files
- All API credentials should be stored in environment variables
- Use HTTPS in production

## Troubleshooting

### Vehicle is Asleep
Click the "Wake Up" button and wait 5-10 seconds for the vehicle to come online.

### Token Expired
The app automatically refreshes tokens. If issues persist, log out and log in again.

### CORS Errors
Ensure your backend is running and the `FRONTEND_URL` environment variable is correctly set.

## License

MIT License - See [LICENSE](LICENSE) for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Tesla Fleet API Documentation](https://developer.tesla.com/docs/fleet-api)
- Built with React.js and Express.js
