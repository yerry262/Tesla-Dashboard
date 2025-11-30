const axios = require('axios');

const TESLA_AUTH_URL = process.env.TESLA_AUTH_URL || 'https://auth.tesla.com/oauth2/v3/authorize';
const TESLA_TOKEN_URL = process.env.TESLA_TOKEN_URL || 'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token';
const TESLA_API_BASE_URL = process.env.TESLA_API_BASE_URL || 'https://fleet-api.prd.na.vn.cloud.tesla.com';

class TeslaAPI {
  constructor() {
    this.clientId = process.env.TESLA_CLIENT_ID;
    this.clientSecret = process.env.TESLA_CLIENT_SECRET;
    this.redirectUri = process.env.TESLA_REDIRECT_URI;
    this.scopes = process.env.TESLA_SCOPES || 'openid offline_access user_data vehicle_device_data vehicle_location vehicle_cmds vehicle_charging_cmds energy_device_data energy_cmds';
  }

  /**
   * Generate the authorization URL for OAuth flow
   */
  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      state: state,
      prompt: 'login'
    });

    return `${TESLA_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(TESLA_TOKEN_URL, 
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.redirectUri,
          audience: TESLA_API_BASE_URL
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type
      };
    } catch (error) {
      console.error('Token exchange error:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for token');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(TESLA_TOKEN_URL,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          refresh_token: refreshToken
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      console.error('Token refresh error:', error.response?.data || error.message);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Make authenticated API request to Tesla Fleet API
   */
  async apiRequest(accessToken, endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: `${TESLA_API_BASE_URL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`API request error (${endpoint}):`, error.response?.data || error.message);
      throw error;
    }
  }

  // ==========================================
  // USER ENDPOINTS
  // ==========================================

  /** Get user info */
  async getMe(accessToken) {
    return this.apiRequest(accessToken, '/api/1/users/me');
  }

  /** Get user feature config */
  async getFeatureConfig(accessToken) {
    return this.apiRequest(accessToken, '/api/1/users/feature_config');
  }

  /** Get user orders */
  async getOrders(accessToken) {
    return this.apiRequest(accessToken, '/api/1/users/orders');
  }

  /** Get user region */
  async getRegion(accessToken) {
    return this.apiRequest(accessToken, '/api/1/users/region');
  }

  // ==========================================
  // VEHICLE ENDPOINTS
  // ==========================================

  /** Get list of vehicles */
  async getVehicles(accessToken) {
    return this.apiRequest(accessToken, '/api/1/vehicles');
  }

  /** Get specific vehicle */
  async getVehicle(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}`);
  }

  /** Get vehicle data with optional endpoints */
  async getVehicleData(accessToken, vehicleId, endpoints = null) {
    let url = `/api/1/vehicles/${vehicleId}/vehicle_data`;
    if (endpoints) {
      url += `?endpoints=${endpoints}`;
    }
    return this.apiRequest(accessToken, url);
  }

  /** Wake up vehicle */
  async wakeUpVehicle(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/wake_up`, 'POST');
  }

  /** Get nearby charging sites */
  async getNearbyChargingSites(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/nearby_charging_sites`);
  }

  /** Check if mobile access is enabled */
  async isMobileEnabled(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/mobile_enabled`);
  }

  /** Get service data */
  async getServiceData(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/service_data`);
  }

  /** Get release notes */
  async getReleaseNotes(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/release_notes`);
  }

  /** Get recent alerts */
  async getRecentAlerts(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/recent_alerts`);
  }

  /** Get drivers */
  async getDrivers(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/drivers`);
  }

  /** Get share invites */
  async getShareInvites(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/invitations`);
  }

  /** Get warranty details */
  async getWarrantyDetails(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/warranty_details`);
  }

  /** Get vehicle options */
  async getVehicleOptions(accessToken, vin) {
    return this.apiRequest(accessToken, `/api/1/dx/vehicles/options?vin=${vin}`);
  }

  /** Get eligible subscriptions */
  async getEligibleSubscriptions(accessToken, vin) {
    return this.apiRequest(accessToken, `/api/1/dx/vehicles/subscriptions/eligibility?vin=${vin}`);
  }

  /** Get eligible upgrades */
  async getEligibleUpgrades(accessToken, vin) {
    return this.apiRequest(accessToken, `/api/1/dx/vehicles/upgrades/eligibility?vin=${vin}`);
  }

  // ==========================================
  // VEHICLE COMMANDS - CLIMATE
  // ==========================================

  /** Start climate preconditioning */
  async startClimate(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/auto_conditioning_start`, 'POST');
  }

  /** Stop climate preconditioning */
  async stopClimate(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/auto_conditioning_stop`, 'POST');
  }

  /** Set cabin temperature */
  async setTemps(accessToken, vehicleId, driverTemp, passengerTemp = null) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_temps`, 'POST', {
      driver_temp: driverTemp,
      passenger_temp: passengerTemp || driverTemp
    });
  }

  /** Set seat heater */
  async setSeatHeater(accessToken, vehicleId, seat, level) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remote_seat_heater_request`, 'POST', {
      seat_position: seat,
      level: level
    });
  }

  /** Set seat cooler */
  async setSeatCooler(accessToken, vehicleId, seat, level) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remote_seat_cooler_request`, 'POST', {
      seat_position: seat,
      seat_cooler_level: level
    });
  }

  /** Set auto seat climate */
  async setAutoSeatClimate(accessToken, vehicleId, seat, enabled) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remote_auto_seat_climate_request`, 'POST', {
      auto_seat_position: seat,
      auto_climate_on: enabled
    });
  }

  /** Set steering wheel heater */
  async setSteeringWheelHeater(accessToken, vehicleId, on) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remote_steering_wheel_heater_request`, 'POST', {
      on: on
    });
  }

  /** Set steering wheel heat level */
  async setSteeringWheelHeatLevel(accessToken, vehicleId, level) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remote_steering_wheel_heat_level_request`, 'POST', {
      level: level
    });
  }

  /** Set auto steering wheel heat */
  async setAutoSteeringWheelHeat(accessToken, vehicleId, on) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remote_auto_steering_wheel_heat_climate_request`, 'POST', {
      on: on
    });
  }

  /** Set climate keeper mode (0=Off, 1=Keep, 2=Dog, 3=Camp) */
  async setClimateKeeperMode(accessToken, vehicleId, mode) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_climate_keeper_mode`, 'POST', {
      climate_keeper_mode: mode
    });
  }

  /** Set bioweapon defense mode */
  async setBioweaponMode(accessToken, vehicleId, on) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_bioweapon_mode`, 'POST', {
      on: on
    });
  }

  /** Set cabin overheat protection */
  async setCabinOverheatProtection(accessToken, vehicleId, on, fanOnly = false) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_cabin_overheat_protection`, 'POST', {
      on: on,
      fan_only: fanOnly
    });
  }

  /** Set cabin overheat protection temp (0=Low, 1=Medium, 2=High) */
  async setCopTemp(accessToken, vehicleId, copTemp) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_cop_temp`, 'POST', {
      cop_temp: copTemp
    });
  }

  /** Set preconditioning max */
  async setPreconditioningMax(accessToken, vehicleId, on) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_preconditioning_max`, 'POST', {
      on: on
    });
  }

  // ==========================================
  // VEHICLE COMMANDS - CHARGING
  // ==========================================

  /** Open charge port door */
  async openChargePort(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/charge_port_door_open`, 'POST');
  }

  /** Close charge port door */
  async closeChargePort(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/charge_port_door_close`, 'POST');
  }

  /** Start charging */
  async startCharging(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/charge_start`, 'POST');
  }

  /** Stop charging */
  async stopCharging(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/charge_stop`, 'POST');
  }

  /** Set charge limit (percent) */
  async setChargeLimit(accessToken, vehicleId, percent) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_charge_limit`, 'POST', {
      percent: percent
    });
  }

  /** Set charging amps */
  async setChargingAmps(accessToken, vehicleId, amps) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_charging_amps`, 'POST', {
      charging_amps: amps
    });
  }

  /** Charge to max range */
  async chargeMaxRange(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/charge_max_range`, 'POST');
  }

  /** Charge to standard range */
  async chargeStandard(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/charge_standard`, 'POST');
  }

  /** Set scheduled charging */
  async setScheduledCharging(accessToken, vehicleId, enable, time) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_scheduled_charging`, 'POST', {
      enable: enable,
      time: time
    });
  }

  /** Set scheduled departure */
  async setScheduledDeparture(accessToken, vehicleId, enable, departureTime, preconditioningEnabled, offPeakChargingEnabled, endOffPeakTime) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_scheduled_departure`, 'POST', {
      enable: enable,
      departure_time: departureTime,
      preconditioning_enabled: preconditioningEnabled,
      off_peak_charging_enabled: offPeakChargingEnabled,
      end_off_peak_time: endOffPeakTime
    });
  }

  /** Add charge schedule */
  async addChargeSchedule(accessToken, vehicleId, schedule) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/add_charge_schedule`, 'POST', schedule);
  }

  /** Remove charge schedule */
  async removeChargeSchedule(accessToken, vehicleId, id) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remove_charge_schedule`, 'POST', { id });
  }

  /** Add precondition schedule */
  async addPreconditionSchedule(accessToken, vehicleId, schedule) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/add_precondition_schedule`, 'POST', schedule);
  }

  /** Remove precondition schedule */
  async removePreconditionSchedule(accessToken, vehicleId, id) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remove_precondition_schedule`, 'POST', { id });
  }

  // ==========================================
  // VEHICLE COMMANDS - LOCKS & SECURITY
  // ==========================================

  /** Lock doors */
  async lockDoors(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/door_lock`, 'POST');
  }

  /** Unlock doors */
  async unlockDoors(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/door_unlock`, 'POST');
  }

  /** Actuate trunk (front or rear) */
  async actuateTrunk(accessToken, vehicleId, whichTrunk) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/actuate_trunk`, 'POST', {
      which_trunk: whichTrunk
    });
  }

  /** Set sentry mode */
  async setSentryMode(accessToken, vehicleId, on) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_sentry_mode`, 'POST', {
      on: on
    });
  }

  /** Set valet mode */
  async setValetMode(accessToken, vehicleId, on, password = null) {
    const data = { on: on };
    if (password) data.password = password;
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_valet_mode`, 'POST', data);
  }

  /** Reset valet PIN */
  async resetValetPin(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/reset_valet_pin`, 'POST');
  }

  /** Set speed limit */
  async setSpeedLimit(accessToken, vehicleId, limitMph) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/speed_limit_set_limit`, 'POST', {
      limit_mph: limitMph
    });
  }

  /** Activate speed limit */
  async activateSpeedLimit(accessToken, vehicleId, pin) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/speed_limit_activate`, 'POST', {
      pin: pin
    });
  }

  /** Deactivate speed limit */
  async deactivateSpeedLimit(accessToken, vehicleId, pin) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/speed_limit_deactivate`, 'POST', {
      pin: pin
    });
  }

  /** Clear speed limit PIN */
  async clearSpeedLimitPin(accessToken, vehicleId, pin) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/speed_limit_clear_pin`, 'POST', {
      pin: pin
    });
  }

  /** Clear speed limit PIN (admin) */
  async clearSpeedLimitPinAdmin(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/speed_limit_clear_pin_admin`, 'POST');
  }

  /** Set PIN to drive */
  async setPinToDrive(accessToken, vehicleId, on, password = null) {
    const data = { on: on };
    if (password) data.password = password;
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_pin_to_drive`, 'POST', data);
  }

  /** Reset PIN to drive */
  async resetPinToDrivePin(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/reset_pin_to_drive_pin`, 'POST');
  }

  /** Clear PIN to drive (admin) */
  async clearPinToDriveAdmin(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/clear_pin_to_drive_admin`, 'POST');
  }

  /** Enable/disable guest mode */
  async setGuestMode(accessToken, vehicleId, enable) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/guest_mode`, 'POST', {
      enable: enable
    });
  }

  /** Erase user data */
  async eraseUserData(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/erase_user_data`, 'POST');
  }

  // ==========================================
  // VEHICLE COMMANDS - WINDOWS & SUNROOF
  // ==========================================

  /** Control windows (vent or close) */
  async controlWindows(accessToken, vehicleId, command, lat = null, lon = null) {
    const data = { command: command };
    if (lat !== null) data.lat = lat;
    if (lon !== null) data.lon = lon;
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/window_control`, 'POST', data);
  }

  /** Control sunroof (stop, close, vent) */
  async controlSunroof(accessToken, vehicleId, state) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/sun_roof_control`, 'POST', {
      state: state
    });
  }

  // ==========================================
  // VEHICLE COMMANDS - LIGHTS & HORN
  // ==========================================

  /** Flash lights */
  async flashLights(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/flash_lights`, 'POST');
  }

  /** Honk horn */
  async honkHorn(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/honk_horn`, 'POST');
  }

  /** Play boombox sound (0=random fart, 2000=locate ping) */
  async remoteBoombox(accessToken, vehicleId, soundId = 2000) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remote_boombox`, 'POST', {
      sound: soundId
    });
  }

  // ==========================================
  // VEHICLE COMMANDS - MEDIA
  // ==========================================

  /** Adjust volume */
  async adjustVolume(accessToken, vehicleId, volume) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/adjust_volume`, 'POST', {
      volume: volume
    });
  }

  /** Toggle media playback */
  async mediaTogglePlayback(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/media_toggle_playback`, 'POST');
  }

  /** Next track */
  async mediaNextTrack(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/media_next_track`, 'POST');
  }

  /** Previous track */
  async mediaPrevTrack(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/media_prev_track`, 'POST');
  }

  /** Next favorite */
  async mediaNextFav(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/media_next_fav`, 'POST');
  }

  /** Previous favorite */
  async mediaPrevFav(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/media_prev_fav`, 'POST');
  }

  /** Volume down */
  async mediaVolumeDown(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/media_volume_down`, 'POST');
  }

  // ==========================================
  // VEHICLE COMMANDS - NAVIGATION
  // ==========================================

  /** Send navigation request */
  async navigationRequest(accessToken, vehicleId, type, value, locale) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/navigation_request`, 'POST', {
      type: type,
      value: value,
      locale: locale
    });
  }

  /** Send GPS navigation request */
  async navigationGpsRequest(accessToken, vehicleId, lat, lon, order = 1) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/navigation_gps_request`, 'POST', {
      lat: lat,
      lon: lon,
      order: order
    });
  }

  /** Navigate to supercharger */
  async navigationScRequest(accessToken, vehicleId, id, order = 1) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/navigation_sc_request`, 'POST', {
      id: id,
      order: order
    });
  }

  /** Send waypoints */
  async navigationWaypointsRequest(accessToken, vehicleId, waypoints) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/navigation_waypoints_request`, 'POST', waypoints);
  }

  // ==========================================
  // VEHICLE COMMANDS - SOFTWARE & MISC
  // ==========================================

  /** Schedule software update */
  async scheduleSoftwareUpdate(accessToken, vehicleId, offsetSec = 0) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/schedule_software_update`, 'POST', {
      offset_sec: offsetSec
    });
  }

  /** Cancel software update */
  async cancelSoftwareUpdate(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/cancel_software_update`, 'POST');
  }

  /** Remote start drive */
  async remoteStartDrive(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/remote_start_drive`, 'POST');
  }

  /** Trigger HomeLink */
  async triggerHomelink(accessToken, vehicleId, lat, lon) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/trigger_homelink`, 'POST', {
      lat: lat,
      lon: lon
    });
  }

  /** Set vehicle name */
  async setVehicleName(accessToken, vehicleId, name) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/set_vehicle_name`, 'POST', {
      vehicle_name: name
    });
  }

  /** Get upcoming calendar entries */
  async getUpcomingCalendarEntries(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/command/upcoming_calendar_entries`, 'POST');
  }

  // ==========================================
  // ENERGY ENDPOINTS
  // ==========================================

  /** Get energy products */
  async getEnergyProducts(accessToken) {
    return this.apiRequest(accessToken, '/api/1/products');
  }

  /** Get energy site info */
  async getEnergySiteInfo(accessToken, siteId) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/site_info`);
  }

  /** Get energy site live status */
  async getEnergySiteLiveStatus(accessToken, siteId) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/live_status`);
  }

  /** Get energy history */
  async getEnergyHistory(accessToken, siteId, period = 'day', kind = 'energy') {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/calendar_history?period=${period}&kind=${kind}`);
  }

  /** Get backup history */
  async getBackupHistory(accessToken, siteId) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/history?kind=backup`);
  }

  /** Get charge history */
  async getChargeHistory(accessToken, siteId) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/history?kind=charge`);
  }

  /** Set backup reserve */
  async setBackupReserve(accessToken, siteId, percent) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/backup`, 'POST', {
      backup_reserve_percent: percent
    });
  }

  /** Set off-grid vehicle charging reserve */
  async setOffGridVehicleChargingReserve(accessToken, siteId, percent) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/off_grid_vehicle_charging_reserve`, 'POST', {
      off_grid_vehicle_charging_reserve_percent: percent
    });
  }

  /** Set storm mode */
  async setStormMode(accessToken, siteId, enabled) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/storm_mode`, 'POST', {
      enabled: enabled
    });
  }

  /** Set energy site operation mode */
  async setEnergyOperation(accessToken, siteId, mode) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/operation`, 'POST', {
      default_real_mode: mode
    });
  }

  /** Set time of use settings */
  async setTimeOfUseSettings(accessToken, siteId, settings) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/time_of_use_settings`, 'POST', {
      tou_settings: settings
    });
  }

  /** Get grid import/export */
  async getGridImportExport(accessToken, siteId) {
    return this.apiRequest(accessToken, `/api/1/energy_sites/${siteId}/grid_import_export`);
  }
}

module.exports = new TeslaAPI();
