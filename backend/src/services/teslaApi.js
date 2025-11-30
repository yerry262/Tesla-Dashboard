const axios = require('axios');

const TESLA_AUTH_URL = process.env.TESLA_AUTH_URL || 'https://auth.tesla.com/oauth2/v3/authorize';
const TESLA_TOKEN_URL = process.env.TESLA_TOKEN_URL || 'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token';
const TESLA_API_BASE_URL = process.env.TESLA_API_BASE_URL || 'https://fleet-api.prd.na.vn.cloud.tesla.com';

class TeslaAPI {
  constructor() {
    this.clientId = process.env.TESLA_CLIENT_ID;
    this.clientSecret = process.env.TESLA_CLIENT_SECRET;
    this.redirectUri = process.env.TESLA_REDIRECT_URI;
    this.scopes = process.env.TESLA_SCOPES || 'openid offline_access user_data vehicle_device_data vehicle_location vehicle_cmds vehicle_charging_cmds';
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

  /**
   * Get list of vehicles
   */
  async getVehicles(accessToken) {
    return this.apiRequest(accessToken, '/api/1/vehicles');
  }

  /**
   * Get vehicle data
   */
  async getVehicleData(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/vehicle_data`);
  }

  /**
   * Wake up vehicle
   */
  async wakeUpVehicle(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/wake_up`, 'POST');
  }

  /**
   * Get nearby charging sites
   */
  async getNearbyChargingSites(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/nearby_charging_sites`);
  }

  /**
   * Check if mobile access is enabled
   */
  async isMobileEnabled(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/mobile_enabled`);
  }

  /**
   * Get service data
   */
  async getServiceData(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/service_data`);
  }

  /**
   * Get release notes
   */
  async getReleaseNotes(accessToken, vehicleId) {
    return this.apiRequest(accessToken, `/api/1/vehicles/${vehicleId}/release_notes`);
  }
}

module.exports = new TeslaAPI();
