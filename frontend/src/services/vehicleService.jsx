import api from './api.jsx';

const vehicleService = {
  /**
   * Get all vehicles
   */
  async getVehicles() {
    const response = await api.get('/api/vehicles');
    return response.data;
  },

  /**
   * Get vehicle data by ID
   */
  async getVehicleData(vehicleId) {
    const response = await api.get(`/api/vehicles/${vehicleId}`);
    return response.data;
  },

  /**
   * Wake up a vehicle
   */
  async wakeVehicle(vehicleId) {
    const response = await api.post(`/api/vehicles/${vehicleId}/wake`);
    return response.data;
  },

  /**
   * Check if mobile access is enabled
   */
  async getMobileEnabled(vehicleId) {
    const response = await api.get(`/api/vehicles/${vehicleId}/mobile-enabled`);
    return response.data;
  },

  /**
   * Get service data
   */
  async getServiceData(vehicleId) {
    const response = await api.get(`/api/vehicles/${vehicleId}/service`);
    return response.data;
  },

  /**
   * Get release notes
   */
  async getReleaseNotes(vehicleId) {
    const response = await api.get(`/api/vehicles/${vehicleId}/release-notes`);
    return response.data;
  },

  /**
   * Get nearby charging sites
   */
  async getNearbyChargingSites(vehicleId) {
    const response = await api.get(`/api/charging/${vehicleId}/nearby`);
    return response.data;
  }
};

export default vehicleService;
