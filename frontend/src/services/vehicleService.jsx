import api from './api.jsx';

const vehicleService = {
  // ==========================================
  // VEHICLE DATA ENDPOINTS
  // ==========================================

  async getVehicles() {
    const response = await api.get('/api/vehicles');
    return response.data;
  },

  async getVehicleData(vehicleId) {
    const response = await api.get(`/api/vehicles/${vehicleId}`);
    return response.data;
  },

  async wakeVehicle(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/wake`);
    return response.data;
  },

  async getMobileEnabled(vehicleId) {
    const response = await api.get(`/api/vehicles/${vehicleId}/mobile-enabled`);
    return response.data;
  },

  async getServiceData(vehicleId) {
    const response = await api.get(`/api/vehicles/${vehicleId}/service`);
    return response.data;
  },

  async getReleaseNotes(vehicleId) {
    const response = await api.get(`/api/vehicles/${vehicleId}/release-notes`);
    return response.data;
  },

  async getNearbyChargingSites(vehicleId) {
    const response = await api.get(`/api/charging/${vehicleId}/nearby`);
    return response.data;
  },

  // ==========================================
  // CLIMATE COMMANDS
  // ==========================================

  async startClimate(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/climate/start`);
    return response.data;
  },

  async stopClimate(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/climate/stop`);
    return response.data;
  },

  async setTemperature(vehicleId, driverTemp, passengerTemp = null) {
    const response = await api.post(`/api/commands/${vehicleId}/climate/temps`, {
      driverTemp,
      passengerTemp
    });
    return response.data;
  },

  async setSeatHeater(vehicleId, seat, level) {
    const response = await api.post(`/api/commands/${vehicleId}/climate/seat-heater`, {
      seat,
      level
    });
    return response.data;
  },

  async setSteeringWheelHeater(vehicleId, on) {
    const response = await api.post(`/api/commands/${vehicleId}/climate/steering-wheel-heater`, {
      on
    });
    return response.data;
  },

  async setClimateKeeperMode(vehicleId, mode) {
    const response = await api.post(`/api/commands/${vehicleId}/climate/keeper-mode`, {
      mode
    });
    return response.data;
  },

  async setBioweaponMode(vehicleId, on) {
    const response = await api.post(`/api/commands/${vehicleId}/climate/bioweapon-mode`, {
      on
    });
    return response.data;
  },

  async setCabinOverheatProtection(vehicleId, on, fanOnly = false) {
    const response = await api.post(`/api/commands/${vehicleId}/climate/cabin-overheat-protection`, {
      on,
      fanOnly
    });
    return response.data;
  },

  // ==========================================
  // CHARGING COMMANDS
  // ==========================================

  async openChargePort(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/charging/open-port`);
    return response.data;
  },

  async closeChargePort(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/charging/close-port`);
    return response.data;
  },

  async startCharging(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/charging/start`);
    return response.data;
  },

  async stopCharging(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/charging/stop`);
    return response.data;
  },

  async setChargeLimit(vehicleId, percent) {
    const response = await api.post(`/api/commands/${vehicleId}/charging/limit`, {
      percent
    });
    return response.data;
  },

  async setChargingAmps(vehicleId, amps) {
    const response = await api.post(`/api/commands/${vehicleId}/charging/amps`, {
      amps
    });
    return response.data;
  },

  async chargeMaxRange(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/charging/max-range`);
    return response.data;
  },

  async chargeStandard(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/charging/standard`);
    return response.data;
  },

  // ==========================================
  // SECURITY COMMANDS
  // ==========================================

  async lockDoors(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/security/lock`);
    return response.data;
  },

  async unlockDoors(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/security/unlock`);
    return response.data;
  },

  async actuateTrunk(vehicleId, whichTrunk) {
    const response = await api.post(`/api/commands/${vehicleId}/security/trunk`, {
      which_trunk: whichTrunk
    });
    return response.data;
  },

  async setSentryMode(vehicleId, on) {
    const response = await api.post(`/api/commands/${vehicleId}/security/sentry`, {
      on
    });
    return response.data;
  },

  async setValetMode(vehicleId, on, password = null) {
    const response = await api.post(`/api/commands/${vehicleId}/security/valet`, {
      on,
      password
    });
    return response.data;
  },

  async setSpeedLimit(vehicleId, limitMph) {
    const response = await api.post(`/api/commands/${vehicleId}/security/speed-limit`, {
      limit_mph: limitMph
    });
    return response.data;
  },

  // ==========================================
  // WINDOWS & SUNROOF COMMANDS
  // ==========================================

  async ventWindows(vehicleId, lat = null, lon = null) {
    const response = await api.post(`/api/commands/${vehicleId}/windows`, {
      command: 'vent',
      lat,
      lon
    });
    return response.data;
  },

  async closeWindows(vehicleId, lat, lon) {
    const response = await api.post(`/api/commands/${vehicleId}/windows`, {
      command: 'close',
      lat,
      lon
    });
    return response.data;
  },

  async controlSunroof(vehicleId, state) {
    const response = await api.post(`/api/commands/${vehicleId}/sunroof`, {
      state
    });
    return response.data;
  },

  // ==========================================
  // LIGHTS & HORN COMMANDS
  // ==========================================

  async flashLights(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/lights/flash`);
    return response.data;
  },

  async honkHorn(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/horn`);
    return response.data;
  },

  async playBoombox(vehicleId, sound = 2000) {
    const response = await api.post(`/api/commands/${vehicleId}/boombox`, {
      sound
    });
    return response.data;
  },

  // ==========================================
  // MEDIA COMMANDS
  // ==========================================

  async toggleMediaPlayback(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/media/toggle`);
    return response.data;
  },

  async mediaNextTrack(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/media/next`);
    return response.data;
  },

  async mediaPrevTrack(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/media/prev`);
    return response.data;
  },

  async setVolume(vehicleId, volume) {
    const response = await api.post(`/api/commands/${vehicleId}/media/volume`, {
      volume
    });
    return response.data;
  },

  // ==========================================
  // SOFTWARE & MISC COMMANDS
  // ==========================================

  async scheduleSoftwareUpdate(vehicleId, offsetSec = 0) {
    const response = await api.post(`/api/commands/${vehicleId}/software/schedule`, {
      offset_sec: offsetSec
    });
    return response.data;
  },

  async cancelSoftwareUpdate(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/software/cancel`);
    return response.data;
  },

  async remoteStartDrive(vehicleId) {
    const response = await api.post(`/api/commands/${vehicleId}/remote-start`);
    return response.data;
  },

  async triggerHomelink(vehicleId, lat, lon) {
    const response = await api.post(`/api/commands/${vehicleId}/homelink`, {
      lat,
      lon
    });
    return response.data;
  },

  async setVehicleName(vehicleId, name) {
    const response = await api.post(`/api/commands/${vehicleId}/name`, {
      name
    });
    return response.data;
  },

  // ==========================================
  // NAVIGATION COMMANDS
  // ==========================================

  async shareNavigation(vehicleId, type, value, locale = 'en-US') {
    const response = await api.post(`/api/commands/${vehicleId}/navigation/share`, {
      type,
      value,
      locale
    });
    return response.data;
  },

  async navigateToGps(vehicleId, lat, lon, order = 1) {
    const response = await api.post(`/api/commands/${vehicleId}/navigation/gps`, {
      lat,
      lon,
      order
    });
    return response.data;
  },

  async navigateToSupercharger(vehicleId, superchargerId, order = 1) {
    const response = await api.post(`/api/commands/${vehicleId}/navigation/supercharger`, {
      id: superchargerId,
      order
    });
    return response.data;
  }
};

export default vehicleService;
