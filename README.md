# Torque Board

A comprehensive React.js + Node.js dashboard for monitoring and controlling Tesla vehicles using the Tesla Fleet API.

![Torque Board](frontend/public/images/torque-board-logo.svg)

## 🚀 Features

- **OAuth 2.0 Authentication** - Secure login with Tesla accounts
- **Multi-Vehicle Support** - View and control multiple vehicles
- **Real-Time Data** - Battery, charging, climate, location, and more
- **Vehicle Commands** - Climate control, charging, locks, and more
- **Mobile Responsive** - Works on desktop and mobile devices
- **Expandable Cards** - Full-width vehicle cards with detailed information

## 📁 Project Structure

```
Tesla-Dashboard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js          # OAuth authentication routes
│   │   │   ├── vehicles.js      # Vehicle data routes
│   │   │   ├── commands.js      # Vehicle command routes
│   │   │   └── user.js          # User endpoint routes
│   │   ├── services/
│   │   │   └── teslaApi.js      # Tesla Fleet API wrapper (70+ endpoints)
│   │   └── index.js             # Express server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── images/
│   │       └── torque-board-logo.svg  # Torque Board logo
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx       # Main layout with navigation
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Dashboard.jsx    # Main dashboard with vehicle cards
│   │   │   └── VehicleDetail.jsx # Detailed vehicle control page
│   │   ├── services/
│   │   │   └── vehicleService.jsx # Frontend API service
│   │   └── App.jsx              # Main React app
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Setup & Installation

### Prerequisites

- Node.js 18+
- Tesla Developer Account
- Registered Tesla Third-Party Application

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Tesla-Dashboard.git
cd Tesla-Dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
# Server Configuration
PORT=3034
NODE_ENV=development

# Tesla API Credentials (from https://developer.tesla.com/dashboard)
TESLA_CLIENT_ID=your_client_id
TESLA_CLIENT_SECRET=your_client_secret

# OAuth Configuration
TESLA_REDIRECT_URI=http://localhost:3033/callback
TESLA_AUTH_URL=https://auth.tesla.com/oauth2/v3/authorize
TESLA_TOKEN_URL=https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token

# Tesla Fleet API Base URL (Choose based on your region)
# North America, Asia-Pacific: https://fleet-api.prd.na.vn.cloud.tesla.com
# Europe, Middle East, Africa: https://fleet-api.prd.eu.vn.cloud.tesla.com
TESLA_API_BASE_URL=https://fleet-api.prd.na.vn.cloud.tesla.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3033

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here

# OAuth Scopes
TESLA_SCOPES=openid offline_access user_data vehicle_device_data vehicle_location vehicle_cmds vehicle_charging_cmds
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:3034
PORT=3033
```

### 4. Start the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:3033 in your browser.

## 🔌 Tesla Fleet API Endpoints

This dashboard implements 70+ Tesla Fleet API endpoints. Below is a comprehensive list of all APIs used and example response data.

---

### 🔐 Authentication Endpoints

#### POST /oauth2/v3/token
Exchange authorization code for access token.

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6...",
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6...",
  "expires_in": 28800,
  "token_type": "Bearer"
}
```

#### POST /oauth2/v3/token (Refresh)
Refresh an expired access token.

---

### 🚗 Vehicle List Endpoints

#### GET /api/1/vehicles
Get list of all vehicles associated with the account.

**Response:**
```json
{
  "response": [
    {
      "id": 1234567890,
      "vehicle_id": 9876543210,
      "vin": "5YJ3E1EA1NF123456",
      "display_name": "Blue Lamb",
      "option_codes": "AD15,MDL3,PBSB,RENA,BT37,ID3W,RF3G,S3PB,DRLH,DV2W,W39B,APF0,COUS,BC3B,CH07,PC30,FC3P,FG31,GLFR,HL31,HM31,IL31,LTPB,MR31,FM3B,RS3H,SA3P,STCP,SC04,SU3C,T3CA,TW00,TM00,UT3P,WR00,AU3P,APH3,AF00,ZCST,MI00,CDM0",
      "color": null,
      "access_type": "OWNER",
      "tokens": ["abc123", "def456"],
      "state": "online",
      "in_service": false,
      "id_s": "1234567890",
      "calendar_enabled": true,
      "api_version": 71,
      "backseat_token": null,
      "backseat_token_updated_at": null,
      "ble_autopair_enrolled": false
    }
  ],
  "count": 1
}
```

---

### 📊 Vehicle Data Endpoints

#### GET /api/1/vehicles/{id}/vehicle_data
Get comprehensive vehicle data. Supports data endpoints parameter.

**Data Endpoints Available:**
- `charge_state` - Charging information
- `climate_state` - Climate/HVAC information
- `drive_state` - Location and driving information
- `gui_settings` - Display settings
- `vehicle_config` - Vehicle configuration
- `vehicle_state` - General vehicle state
- `location_data` - GPS location

**Response:**
```json
{
  "response": {
    "id": 1234567890,
    "user_id": 9876543210,
    "vehicle_id": 1122334455,
    "vin": "5YJ3E1EA1NF123456",
    "display_name": "Blue Lamb",
    "state": "online",
    "charge_state": {
      "battery_level": 78,
      "battery_range": 245.67,
      "charge_current_request": 32,
      "charge_current_request_max": 32,
      "charge_enable_request": true,
      "charge_energy_added": 12.45,
      "charge_limit_soc": 80,
      "charge_limit_soc_max": 100,
      "charge_limit_soc_min": 50,
      "charge_limit_soc_std": 90,
      "charge_miles_added_ideal": 50.0,
      "charge_miles_added_rated": 45.5,
      "charge_port_door_open": false,
      "charge_port_latch": "Engaged",
      "charge_rate": 0.0,
      "charger_actual_current": 0,
      "charger_phases": null,
      "charger_pilot_current": 32,
      "charger_power": 0,
      "charger_voltage": 0,
      "charging_state": "Disconnected",
      "conn_charge_cable": "<invalid>",
      "est_battery_range": 198.45,
      "fast_charger_brand": "<invalid>",
      "fast_charger_present": false,
      "fast_charger_type": "<invalid>",
      "ideal_battery_range": 256.78,
      "max_range_charge_counter": 0,
      "minutes_to_full_charge": 0,
      "not_enough_power_to_heat": null,
      "off_peak_charging_enabled": false,
      "off_peak_charging_times": "all_week",
      "off_peak_hours_end_time": 360,
      "preconditioning_enabled": false,
      "preconditioning_times": "all_week",
      "scheduled_charging_mode": "Off",
      "scheduled_charging_pending": false,
      "scheduled_charging_start_time": null,
      "scheduled_departure_time": 1640000000,
      "supercharger_session_trip_planner": false,
      "time_to_full_charge": 0.0,
      "timestamp": 1640000000000,
      "trip_charging": false,
      "usable_battery_level": 77,
      "user_charge_enable_request": null
    },
    "climate_state": {
      "allow_cabin_overheat_protection": true,
      "auto_seat_climate_left": true,
      "auto_seat_climate_right": true,
      "battery_heater": false,
      "battery_heater_no_power": null,
      "cabin_overheat_protection": "On",
      "cabin_overheat_protection_actively_cooling": false,
      "climate_keeper_mode": "off",
      "cop_activation_temperature": "High",
      "defrost_mode": 0,
      "driver_temp_setting": 21.0,
      "fan_status": 0,
      "hvac_auto_request": "On",
      "inside_temp": 22.5,
      "is_auto_conditioning_on": false,
      "is_climate_on": false,
      "is_front_defroster_on": false,
      "is_preconditioning": false,
      "is_rear_defroster_on": false,
      "left_temp_direction": -293,
      "max_avail_temp": 28.0,
      "min_avail_temp": 15.0,
      "outside_temp": 18.0,
      "passenger_temp_setting": 21.0,
      "remote_heater_control_enabled": false,
      "right_temp_direction": -293,
      "seat_heater_left": 0,
      "seat_heater_rear_center": 0,
      "seat_heater_rear_left": 0,
      "seat_heater_rear_right": 0,
      "seat_heater_right": 0,
      "side_mirror_heaters": false,
      "steering_wheel_heat_level": 0,
      "steering_wheel_heater": false,
      "supports_fan_only_cabin_overheat_protection": true,
      "timestamp": 1640000000000,
      "wiper_blade_heater": false
    },
    "drive_state": {
      "active_route_latitude": 37.7749,
      "active_route_longitude": -122.4194,
      "active_route_traffic_minutes_delay": 0.0,
      "gps_as_of": 1640000000,
      "heading": 180,
      "latitude": 37.7749295,
      "longitude": -122.4194155,
      "native_latitude": 37.7749295,
      "native_location_supported": 1,
      "native_longitude": -122.4194155,
      "native_type": "wgs",
      "power": 0,
      "shift_state": null,
      "speed": null,
      "timestamp": 1640000000000
    },
    "gui_settings": {
      "gui_24_hour_time": false,
      "gui_charge_rate_units": "mi/hr",
      "gui_distance_units": "mi/hr",
      "gui_range_display": "Rated",
      "gui_temperature_units": "F",
      "gui_tirepressure_units": "Psi",
      "show_range_units": true,
      "timestamp": 1640000000000
    },
    "vehicle_config": {
      "aux_park_lamps": "Eu",
      "badge_version": 0,
      "can_accept_navigation_requests": true,
      "can_actuate_trunks": true,
      "car_special_type": "base",
      "car_type": "model3",
      "charge_port_type": "US",
      "cop_user_set_temp_supported": false,
      "dashcam_clip_save_supported": true,
      "default_charge_to_max": false,
      "driver_assist": "TeslaAP3",
      "ece_restrictions": false,
      "efficiency_package": "Default",
      "eu_vehicle": false,
      "exterior_color": "MidnightSilver",
      "exterior_trim": "Chrome",
      "exterior_trim_override": "",
      "has_air_suspension": false,
      "has_ludicrous_mode": false,
      "has_seat_cooling": false,
      "headlamp_type": "Premium",
      "interior_trim_type": "Black",
      "key_version": 2,
      "motorized_charge_port": true,
      "paint_color_override": "",
      "performance_package": "Base",
      "plg": true,
      "pws": false,
      "rear_drive_unit": "PM216MOSFET",
      "rear_seat_heaters": 1,
      "rear_seat_type": 0,
      "rhd": false,
      "roof_color": "RoofColorGlass",
      "seat_type": null,
      "spoiler_type": "None",
      "sun_roof_installed": null,
      "supports_qr_pairing": false,
      "third_row_seats": "None",
      "timestamp": 1640000000000,
      "trim_badging": "74d",
      "use_range_badging": true,
      "utc_offset": -28800,
      "webcam_selfie_supported": true,
      "webcam_supported": true,
      "wheel_type": "Pinwheel18"
    },
    "vehicle_state": {
      "api_version": 71,
      "autopark_state_v2": "standby",
      "calendar_supported": true,
      "car_version": "2023.44.30.1 abc123def",
      "center_display_state": 0,
      "dashcam_clip_save_available": true,
      "dashcam_state": "Recording",
      "df": 0,
      "dr": 0,
      "fd_window": 0,
      "feature_bitmask": "15,0",
      "fp_window": 0,
      "ft": 0,
      "homelink_device_count": 2,
      "homelink_nearby": true,
      "is_user_present": false,
      "last_autopark_error": "no_error",
      "locked": true,
      "media_info": {
        "a2dp_source_name": "iPhone",
        "audio_volume": 2.3333,
        "audio_volume_increment": 0.333333,
        "audio_volume_max": 10.333333,
        "media_playback_status": "Stopped",
        "now_playing_album": "",
        "now_playing_artist": "",
        "now_playing_duration": 0,
        "now_playing_elapsed": 0,
        "now_playing_source": "12",
        "now_playing_station": "",
        "now_playing_title": ""
      },
      "media_state": {
        "remote_control_enabled": true
      },
      "notifications_supported": true,
      "odometer": 45678.123456,
      "parsed_calendar_supported": true,
      "pf": 0,
      "pr": 0,
      "rd_window": 0,
      "remote_start": false,
      "remote_start_enabled": true,
      "remote_start_supported": true,
      "rp_window": 0,
      "rt": 0,
      "santa_mode": 0,
      "sentry_mode": false,
      "sentry_mode_available": true,
      "service_mode": false,
      "service_mode_plus": false,
      "smart_summon_available": false,
      "software_update": {
        "download_perc": 0,
        "expected_duration_sec": 2700,
        "install_perc": 0,
        "status": "",
        "version": ""
      },
      "speed_limit_mode": {
        "active": false,
        "current_limit_mph": 85.0,
        "max_limit_mph": 120,
        "min_limit_mph": 50,
        "pin_code_set": false
      },
      "summon_standby_mode_enabled": false,
      "timestamp": 1640000000000,
      "tpms_hard_warning_fl": false,
      "tpms_hard_warning_fr": false,
      "tpms_hard_warning_rl": false,
      "tpms_hard_warning_rr": false,
      "tpms_last_seen_pressure_time_fl": 1640000000,
      "tpms_last_seen_pressure_time_fr": 1640000000,
      "tpms_last_seen_pressure_time_rl": 1640000000,
      "tpms_last_seen_pressure_time_rr": 1640000000,
      "tpms_pressure_fl": 2.9,
      "tpms_pressure_fr": 2.9,
      "tpms_pressure_rl": 2.9,
      "tpms_pressure_rr": 2.9,
      "tpms_rcp_front_value": 2.9,
      "tpms_rcp_rear_value": 2.9,
      "tpms_soft_warning_fl": false,
      "tpms_soft_warning_fr": false,
      "tpms_soft_warning_rl": false,
      "tpms_soft_warning_rr": false,
      "valet_mode": false,
      "valet_pin_needed": true,
      "vehicle_name": "Blue Lamb",
      "vehicle_self_test_progress": 0,
      "vehicle_self_test_requested": false,
      "webcam_available": true
    }
  }
}
```

---

### 🔋 Charging Endpoints

#### GET /api/1/vehicles/{id}/data_request/charge_state
Get charging state only.

#### POST /api/1/vehicles/{id}/command/charge_start
Start charging.

**Response:**
```json
{
  "response": {
    "reason": "",
    "result": true
  }
}
```

#### POST /api/1/vehicles/{id}/command/charge_stop
Stop charging.

#### POST /api/1/vehicles/{id}/command/charge_port_door_open
Open charge port door.

#### POST /api/1/vehicles/{id}/command/charge_port_door_close
Close charge port door.

#### POST /api/1/vehicles/{id}/command/set_charge_limit
Set charge limit percentage.

**Request Body:**
```json
{
  "percent": 80
}
```

#### POST /api/1/vehicles/{id}/command/charge_standard
Set charge limit to standard (90%).

#### POST /api/1/vehicles/{id}/command/charge_max_range
Set charge limit to max range (100%).

#### POST /api/1/vehicles/{id}/command/set_scheduled_charging
Set scheduled charging time.

**Request Body:**
```json
{
  "enable": true,
  "time": 420
}
```

#### POST /api/1/vehicles/{id}/command/set_scheduled_departure
Set scheduled departure time.

**Request Body:**
```json
{
  "enable": true,
  "departure_time": 420,
  "preconditioning_enabled": true,
  "preconditioning_weekdays_only": false,
  "off_peak_charging_enabled": true,
  "off_peak_charging_weekdays_only": false,
  "end_off_peak_time": 360
}
```

---

### ❄️ Climate Control Endpoints

#### GET /api/1/vehicles/{id}/data_request/climate_state
Get climate state only.

#### POST /api/1/vehicles/{id}/command/auto_conditioning_start
Start HVAC system.

**Response:**
```json
{
  "response": {
    "reason": "",
    "result": true
  }
}
```

#### POST /api/1/vehicles/{id}/command/auto_conditioning_stop
Stop HVAC system.

#### POST /api/1/vehicles/{id}/command/set_temps
Set driver and passenger temperature.

**Request Body:**
```json
{
  "driver_temp": 21.0,
  "passenger_temp": 21.0
}
```

#### POST /api/1/vehicles/{id}/command/set_preconditioning_max
Set maximum preconditioning (defrost mode).

**Request Body:**
```json
{
  "on": true
}
```

#### POST /api/1/vehicles/{id}/command/remote_seat_heater_request
Set seat heater level.

**Request Body:**
```json
{
  "heater": 0,
  "level": 3
}
```
**Heater positions:** 0=Driver, 1=Passenger, 2=Rear Left, 4=Rear Center, 5=Rear Right
**Levels:** 0=Off, 1=Low, 2=Medium, 3=High

#### POST /api/1/vehicles/{id}/command/remote_steering_wheel_heater_request
Set steering wheel heater.

**Request Body:**
```json
{
  "on": true
}
```

#### POST /api/1/vehicles/{id}/command/set_bioweapon_mode
Set bioweapon defense mode (Model X/S).

**Request Body:**
```json
{
  "on": true
}
```

#### POST /api/1/vehicles/{id}/command/set_climate_keeper_mode
Set climate keeper mode.

**Request Body:**
```json
{
  "climate_keeper_mode": 1
}
```
**Modes:** 0=Off, 1=Keep, 2=Dog, 3=Camp

#### POST /api/1/vehicles/{id}/command/remote_seat_cooler_request
Set seat cooler level (if equipped).

**Request Body:**
```json
{
  "seat_position": 0,
  "seat_cooler_level": 2
}
```

#### POST /api/1/vehicles/{id}/command/set_cop_temp
Set cabin overheat protection temperature.

**Request Body:**
```json
{
  "cop_temp": 1
}
```
**Values:** 0=Low, 1=Medium, 2=High

#### POST /api/1/vehicles/{id}/command/set_cabin_overheat_protection
Set cabin overheat protection mode.

**Request Body:**
```json
{
  "on": true,
  "fan_only": false
}
```

#### POST /api/1/vehicles/{id}/command/remote_auto_seat_climate_request
Set auto seat climate.

**Request Body:**
```json
{
  "auto_seat_position": 1,
  "auto_climate_on": true
}
```

---

### 🔒 Security Endpoints

#### POST /api/1/vehicles/{id}/command/door_lock
Lock doors.

**Response:**
```json
{
  "response": {
    "reason": "",
    "result": true
  }
}
```

#### POST /api/1/vehicles/{id}/command/door_unlock
Unlock doors.

#### POST /api/1/vehicles/{id}/command/set_sentry_mode
Enable/disable sentry mode.

**Request Body:**
```json
{
  "on": true
}
```

#### POST /api/1/vehicles/{id}/command/set_valet_mode
Enable/disable valet mode.

**Request Body:**
```json
{
  "on": true,
  "password": "1234"
}
```

#### POST /api/1/vehicles/{id}/command/reset_valet_pin
Reset valet PIN.

---

### 🚪 Trunk & Frunk Endpoints

#### POST /api/1/vehicles/{id}/command/actuate_trunk
Actuate trunk or frunk.

**Request Body:**
```json
{
  "which_trunk": "rear"
}
```
**Values:** "rear" or "front"

---

### 🪟 Window Endpoints

#### POST /api/1/vehicles/{id}/command/window_control
Control windows.

**Request Body:**
```json
{
  "command": "vent",
  "lat": 0,
  "lon": 0
}
```
**Commands:** "vent" or "close"

---

### 📍 Location & Navigation Endpoints

#### GET /api/1/vehicles/{id}/data_request/drive_state
Get drive/location state only.

#### POST /api/1/vehicles/{id}/command/navigation_request
Send navigation destination.

**Request Body:**
```json
{
  "type": "share_ext_content_raw",
  "locale": "en-US",
  "timestamp_ms": 1640000000000,
  "value": {
    "android.intent.extra.TEXT": "1600 Amphitheatre Parkway, Mountain View, CA"
  }
}
```

#### POST /api/1/vehicles/{id}/command/navigation_sc_request
Navigate to nearest Supercharger.

**Request Body:**
```json
{
  "type": "supercharger",
  "id": 123,
  "order_id": 456
}
```

#### POST /api/1/vehicles/{id}/command/navigation_gps_request
Navigate to GPS coordinates.

**Request Body:**
```json
{
  "lat": 37.7749,
  "lon": -122.4194,
  "order": 1
}
```

---

### 🔔 Alert Endpoints

#### POST /api/1/vehicles/{id}/command/flash_lights
Flash lights.

**Response:**
```json
{
  "response": {
    "reason": "",
    "result": true
  }
}
```

#### POST /api/1/vehicles/{id}/command/honk_horn
Honk horn.

---

### 🏠 HomeLink Endpoints

#### POST /api/1/vehicles/{id}/command/trigger_homelink
Trigger HomeLink.

**Request Body:**
```json
{
  "lat": 37.7749,
  "lon": -122.4194
}
```

---

### 🎵 Media Endpoints

#### POST /api/1/vehicles/{id}/command/media_toggle_playback
Toggle media playback.

#### POST /api/1/vehicles/{id}/command/media_next_track
Skip to next track.

#### POST /api/1/vehicles/{id}/command/media_prev_track
Go to previous track.

#### POST /api/1/vehicles/{id}/command/media_next_fav
Skip to next favorite.

#### POST /api/1/vehicles/{id}/command/media_prev_fav
Go to previous favorite.

#### POST /api/1/vehicles/{id}/command/media_volume_up
Increase volume.

#### POST /api/1/vehicles/{id}/command/media_volume_down
Decrease volume.

#### POST /api/1/vehicles/{id}/command/adjust_volume
Set specific volume.

**Request Body:**
```json
{
  "volume": 5.5
}
```

---

### 🚘 Remote Start Endpoints

#### POST /api/1/vehicles/{id}/command/remote_start_drive
Enable keyless driving (2 min).

#### POST /api/1/vehicles/{id}/command/set_pin_to_drive
Set PIN to drive.

**Request Body:**
```json
{
  "on": true,
  "password": "1234"
}
```

---

### ⚡ Speed Limit Endpoints

#### POST /api/1/vehicles/{id}/command/speed_limit_activate
Activate speed limit mode.

**Request Body:**
```json
{
  "pin": "1234"
}
```

#### POST /api/1/vehicles/{id}/command/speed_limit_deactivate
Deactivate speed limit mode.

**Request Body:**
```json
{
  "pin": "1234"
}
```

#### POST /api/1/vehicles/{id}/command/speed_limit_set_limit
Set speed limit.

**Request Body:**
```json
{
  "limit_mph": 70
}
```

#### POST /api/1/vehicles/{id}/command/speed_limit_clear_pin
Clear speed limit PIN.

**Request Body:**
```json
{
  "pin": "1234"
}
```

---

### 🔧 Software Update Endpoints

#### POST /api/1/vehicles/{id}/command/schedule_software_update
Schedule software update.

**Request Body:**
```json
{
  "offset_sec": 7200
}
```

#### POST /api/1/vehicles/{id}/command/cancel_software_update
Cancel scheduled software update.

---

### 🔊 Boombox Endpoints

#### POST /api/1/vehicles/{id}/command/remote_boombox
Play boombox sound.

**Request Body:**
```json
{
  "sound": 0
}
```
**Sounds:** 0=Fart, 2000=Custom

---

### 🎥 Camera Endpoints

#### POST /api/1/vehicles/{id}/command/take_drivenote
Save dashcam clip.

---

### ⏰ Wake Endpoints

#### POST /api/1/vehicles/{id}/wake_up
Wake up vehicle.

**Response:**
```json
{
  "response": {
    "id": 1234567890,
    "user_id": 9876543210,
    "vehicle_id": 1122334455,
    "vin": "5YJ3E1EA1NF123456",
    "display_name": "Blue Lamb",
    "state": "online",
    "in_service": false,
    "id_s": "1234567890",
    "calendar_enabled": true,
    "api_version": 71
  }
}
```

---

### 📍 Nearby Charging Endpoints

#### GET /api/1/vehicles/{id}/nearby_charging_sites
Get nearby charging sites.

**Response:**
```json
{
  "response": {
    "congestion_sync_time_utc_secs": 1640000000,
    "destination_charging": [
      {
        "location": {
          "lat": 37.7749,
          "long": -122.4194
        },
        "name": "Hotel Tesla Charger",
        "type": "destination",
        "distance_miles": 0.5
      }
    ],
    "superchargers": [
      {
        "location": {
          "lat": 37.7849,
          "long": -122.4094
        },
        "name": "San Francisco Supercharger",
        "type": "supercharger",
        "distance_miles": 1.2,
        "available_stalls": 8,
        "total_stalls": 12,
        "site_closed": false
      }
    ],
    "timestamp": 1640000000000
  }
}
```

---

### 👤 User Endpoints

#### GET /api/1/users/me
Get current user info.

**Response:**
```json
{
  "response": {
    "email": "user@example.com",
    "full_name": "John Doe",
    "profile_image_url": "https://...",
    "vault_uuid": "abc123"
  }
}
```

#### GET /api/1/users/feature_config
Get user feature configuration.

#### GET /api/1/users/orders
Get user orders.

#### GET /api/1/users/region
Get user region.

---

### 🔋 Energy Product Endpoints (Powerwall/Solar)

#### GET /api/1/products
Get all energy products.

**Response:**
```json
{
  "response": [
    {
      "energy_site_id": 1234567890,
      "resource_type": "battery",
      "site_name": "Home",
      "id": "STE1234567-00000",
      "gateway_id": "1234567-00-E--TG1234567890AB",
      "asset_site_id": "abc123",
      "energy_left": 13500,
      "total_pack_energy": 13500,
      "percentage_charged": 100,
      "battery_type": "ac_powerwall",
      "backup_capable": true,
      "battery_power": 0,
      "sync_grid_alert_enabled": true,
      "breaker_alert_enabled": false
    }
  ],
  "count": 1
}
```

#### GET /api/1/energy_sites/{site_id}/site_status
Get energy site status.

#### GET /api/1/energy_sites/{site_id}/live_status
Get live energy site status.

**Response:**
```json
{
  "response": {
    "solar_power": 5400,
    "energy_left": 12500,
    "total_pack_energy": 13500,
    "percentage_charged": 92.5,
    "backup_capable": true,
    "battery_power": -2000,
    "load_power": 3400,
    "grid_status": "Active",
    "grid_services_active": false,
    "grid_power": 0,
    "grid_services_power": 0,
    "generator_power": 0,
    "island_status": "on_grid",
    "storm_mode_active": false,
    "timestamp": "2023-12-20T12:00:00Z",
    "wall_connectors": []
  }
}
```

#### GET /api/1/energy_sites/{site_id}/site_info
Get energy site info.

#### GET /api/1/energy_sites/{site_id}/calendar_history
Get calendar history for energy site.

**Query Parameters:**
- `kind` - "energy" or "power"
- `period` - "day", "week", "month", "year"
- `start_date` - ISO date
- `end_date` - ISO date

#### POST /api/1/energy_sites/{site_id}/backup
Set backup reserve percentage.

**Request Body:**
```json
{
  "backup_reserve_percent": 20
}
```

#### POST /api/1/energy_sites/{site_id}/operation
Set operation mode.

**Request Body:**
```json
{
  "default_real_mode": "self_consumption"
}
```
**Modes:** "self_consumption", "backup", "autonomous"

#### POST /api/1/energy_sites/{site_id}/storm_mode
Set storm watch mode.

**Request Body:**
```json
{
  "enabled": true
}
```

#### POST /api/1/energy_sites/{site_id}/grid_import_export
Set grid import/export settings.

---

## 🛠️ Backend API Routes

### Authentication Routes (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login` | Initiate OAuth flow |
| GET | `/auth/callback` | OAuth callback handler |
| GET | `/auth/token` | Get current token |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout and clear session |

### Vehicle Routes (`/api/vehicles`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | List all vehicles |
| GET | `/api/vehicles/:id` | Get vehicle by ID |
| GET | `/api/vehicles/:id/data` | Get vehicle data |
| GET | `/api/vehicles/:id/charge_state` | Get charge state |
| GET | `/api/vehicles/:id/climate_state` | Get climate state |
| GET | `/api/vehicles/:id/drive_state` | Get drive state |
| GET | `/api/vehicles/:id/gui_settings` | Get GUI settings |
| GET | `/api/vehicles/:id/vehicle_config` | Get vehicle config |
| GET | `/api/vehicles/:id/vehicle_state` | Get vehicle state |
| GET | `/api/vehicles/:id/nearby_charging` | Get nearby chargers |
| POST | `/api/vehicles/:id/wake` | Wake up vehicle |

### Command Routes (`/api/vehicles/:id/command`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `.../climate/start` | Start climate |
| POST | `.../climate/stop` | Stop climate |
| POST | `.../climate/set_temps` | Set temperatures |
| POST | `.../climate/defrost` | Set defrost mode |
| POST | `.../climate/seat_heater` | Set seat heater |
| POST | `.../climate/steering_wheel_heater` | Set steering wheel heater |
| POST | `.../climate/climate_keeper` | Set climate keeper mode |
| POST | `.../climate/bioweapon_mode` | Set bioweapon mode |
| POST | `.../climate/cabin_overheat_protection` | Set COP |
| POST | `.../climate/cop_temp` | Set COP temp |
| POST | `.../climate/auto_seat_climate` | Set auto seat climate |
| POST | `.../climate/seat_cooler` | Set seat cooler |
| POST | `.../charge/start` | Start charging |
| POST | `.../charge/stop` | Stop charging |
| POST | `.../charge/set_limit` | Set charge limit |
| POST | `.../charge/standard` | Set standard charge |
| POST | `.../charge/max_range` | Set max range charge |
| POST | `.../charge/port/open` | Open charge port |
| POST | `.../charge/port/close` | Close charge port |
| POST | `.../charge/scheduled_charging` | Set scheduled charging |
| POST | `.../charge/scheduled_departure` | Set scheduled departure |
| POST | `.../security/lock` | Lock doors |
| POST | `.../security/unlock` | Unlock doors |
| POST | `.../security/sentry` | Set sentry mode |
| POST | `.../security/valet` | Set valet mode |
| POST | `.../security/reset_valet_pin` | Reset valet PIN |
| POST | `.../security/pin_to_drive` | Set PIN to drive |
| POST | `.../trunk` | Actuate trunk |
| POST | `.../frunk` | Actuate frunk |
| POST | `.../windows` | Control windows |
| POST | `.../flash` | Flash lights |
| POST | `.../honk` | Honk horn |
| POST | `.../homelink` | Trigger HomeLink |
| POST | `.../remote_start` | Remote start drive |
| POST | `.../media/toggle` | Toggle media |
| POST | `.../media/next` | Next track |
| POST | `.../media/prev` | Previous track |
| POST | `.../media/volume_up` | Volume up |
| POST | `.../media/volume_down` | Volume down |
| POST | `.../media/volume` | Set volume |
| POST | `.../navigation/request` | Send navigation |
| POST | `.../navigation/supercharger` | Nav to Supercharger |
| POST | `.../navigation/gps` | Nav to GPS coords |
| POST | `.../speed_limit/activate` | Activate speed limit |
| POST | `.../speed_limit/deactivate` | Deactivate speed limit |
| POST | `.../speed_limit/set` | Set speed limit |
| POST | `.../speed_limit/clear_pin` | Clear speed limit PIN |
| POST | `.../software/schedule_update` | Schedule update |
| POST | `.../software/cancel_update` | Cancel update |
| POST | `.../boombox` | Play boombox |
| POST | `.../dashcam` | Save dashcam clip |

### User Routes (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get user info |
| GET | `/api/user/feature-config` | Get feature config |
| GET | `/api/user/orders` | Get orders |
| GET | `/api/user/region` | Get region |

### Energy Routes (`/api/energy`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/energy/products` | List energy products |
| GET | `/api/energy/sites/:id/status` | Get site status |
| GET | `/api/energy/sites/:id/live_status` | Get live status |
| GET | `/api/energy/sites/:id/info` | Get site info |
| GET | `/api/energy/sites/:id/history` | Get history |
| POST | `/api/energy/sites/:id/backup` | Set backup reserve |
| POST | `/api/energy/sites/:id/operation` | Set operation mode |
| POST | `/api/energy/sites/:id/storm_mode` | Set storm mode |

---

## 🔐 Tesla Partner Registration & Virtual Key Setup

To use the Tesla Fleet API with vehicle commands, you must complete these steps:

### 1. Create Tesla Developer Account
- Go to https://developer.tesla.com
- Register your application
- Get your Client ID and Client Secret

### 2. Configure OAuth Settings
In the Tesla Developer Portal, set:

**Allowed Origin(s):**
```
https://yourdomain.com/
http://localhost:3033/
```

**Allowed Redirect URI(s):**
```
https://yourdomain.com/callback
http://localhost:3033/callback
```

### 3. Generate Key Pair
```bash
cd backend
openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem
openssl ec -in private-key.pem -pubout -out public-key.pem
```

### 4. Host Public Key
Host your `public-key.pem` at:
```
https://yourdomain.com/.well-known/appspecific/com.tesla.3p.public-key.pem
```

### 5. Register Partner Account
Run the registration script:
```bash
cd backend
node scripts/register-partner.js
```

Or manually register:
```bash
curl --location 'https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/partner_accounts' \
  --header 'Authorization: Bearer <partner_token>' \
  --header 'Content-Type: application/json' \
  --data '{"domain": "yourdomain.com"}'
```

### 6. Pair Virtual Key with Vehicle
After registration, open this link on your phone (with Tesla app installed):
```
https://tesla.com/_ak/yourdomain.com?vin=YOUR_VIN
```

This will prompt you to add the virtual key to your vehicle. You must be near the vehicle with your Tesla key card.

### 7. Verify Registration
Check if your public key is registered:
```bash
node scripts/check-registration.js
```

---

## 📱 Mobile Responsiveness

The dashboard is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

Features:
- Expandable vehicle cards
- Touch-friendly controls
- Responsive grid layouts
- Mobile navigation

---

## 🎨 UI Components

### Dashboard
- Full-width vehicle cards (1 per row)
- Click to expand/collapse details
- Quick view: Battery, Charging, Climate, Security status
- Navigate to detailed vehicle page

### Vehicle Detail Page
- **Quick Actions**: Flash, Honk, Windows, HomeLink, Boombox
- **Climate Section**: Start/Stop, Temperature, Defrost, Dog/Camp Mode, Seat Heaters
- **Charging Section**: Start/Stop, Port Control, Charge Limit Slider
- **Security Section**: Lock/Unlock, Trunk, Frunk, Sentry Mode, Valet Mode

---

## 📄 License

MIT License

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## ⚠️ Disclaimer

This project is not affiliated with Tesla, Inc. Use at your own risk. Always follow Tesla's API terms of service.
