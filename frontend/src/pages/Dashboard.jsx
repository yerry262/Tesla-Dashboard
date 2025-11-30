import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService.jsx';
import { 
  FiRefreshCw, FiAlertCircle, FiChevronDown, FiChevronUp,
  FiBattery, FiThermometer, FiMapPin, FiLock, FiUnlock,
  FiWifi, FiWifiOff, FiZap, FiSun, FiMoon, FiNavigation
} from 'react-icons/fi';
import { 
  BsThermometerHalf, BsLightningCharge, BsShieldLock, 
  BsSpeedometer, BsDoorOpen, BsSnow
} from 'react-icons/bs';
import './Dashboard.css';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [expandedVehicles, setExpandedVehicles] = useState({});
      const [loadingDetails, setLoadingDetails] = useState({});
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setError(null);
      const response = await vehicleService.getVehicles();
      setVehicles(response.response || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setVehicleDetails({});
    fetchVehicles();
  };

  const fetchVehicleDetails = async (vehicleId) => {
    if (vehicleDetails[vehicleId]) return;
    
    setLoadingDetails(prev => ({ ...prev, [vehicleId]: true }));
    try {
      const data = await vehicleService.getVehicleData(vehicleId);
      setVehicleDetails(prev => ({ ...prev, [vehicleId]: data.response }));
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [vehicleId]: false }));
    }
  };

  const toggleExpand = async (vehicleId) => {
    const isExpanding = !expandedVehicles[vehicleId];
    setExpandedVehicles(prev => ({ ...prev, [vehicleId]: isExpanding }));
    
    if (isExpanding) {
      await fetchVehicleDetails(vehicleId);
    }
  };

  const getStateInfo = (state) => {
    switch (state) {
      case 'online': return { label: 'Online', class: 'success', icon: FiWifi };
      case 'asleep': return { label: 'Asleep', class: 'warning', icon: FiMoon };
      case 'offline': return { label: 'Offline', class: 'error', icon: FiWifiOff };
      default: return { label: state, class: '', icon: FiWifiOff };
    }
  };

  const formatTemperature = (celsius) => {
    if (celsius == null) return '--';
    const fahrenheit = (celsius * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  };

  const formatRange = (miles) => {
    if (miles == null) return '--';
    return `${Math.round(miles)} mi`;
  };

  const navigateToDetails = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}`);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monitor your Tesla vehicles at a glance</p>
        </div>
        <button 
          className={`btn btn-secondary ${refreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FiRefreshCw size={18} className={refreshing ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <FiAlertCircle size={20} />
          <span>{error}</span>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3>No Vehicles Found</h3>
          <p>No vehicles are linked to your Tesla account.</p>
        </div>
      ) : (
        <div className="vehicles-list">
          {vehicles.map((vehicle) => {
            const stateInfo = getStateInfo(vehicle.state);
            const StateIcon = stateInfo.icon;
            const isExpanded = expandedVehicles[vehicle.id];
            const details = vehicleDetails[vehicle.id];
            const isLoadingDetails = loadingDetails[vehicle.id];

            return (
              <div key={vehicle.id} className={`vehicle-row ${isExpanded ? 'expanded' : ''}`}>
                {/* Main Vehicle Info Row */}
                <div className="vehicle-row-header" onClick={() => toggleExpand(vehicle.id)}>
                  <div className="vehicle-main-info">
                    <span className="vehicle-emoji-icon">🚗</span>
                    <div className="vehicle-name-section">
                      <h3 className="vehicle-name">{vehicle.display_name || 'Tesla Vehicle'}</h3>
                      <span className="vehicle-model-badge">
                        {vehicle.vehicle_config?.car_type?.replace(/_/g, ' ').toUpperCase() || 'Tesla'}
                      </span>
                    </div>
                  </div>

                  <div className="vehicle-quick-info">
                    <div className={`vehicle-status-badge status-${stateInfo.class}`}>
                      <StateIcon size={14} />
                      <span>{stateInfo.label}</span>
                    </div>
                  </div>

                  <div className="vehicle-expand-btn">
                    {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="vehicle-expanded-content">
                    {isLoadingDetails ? (
                      <div className="details-loading">
                        <div className="loading-spinner small"></div>
                        <span>Loading vehicle data...</span>
                      </div>
                    ) : details ? (
                      <>
                        {/* Summary Stats Grid */}
                        <div className="summary-stats-grid">

                          {/* Battery */}
                          <div className="summary-stat-card">
                            <div className="stat-icon battery">
                              <FiBattery size={20} />
                            </div>
                            <div className="stat-content">
                              <span className="stat-value">
                                {details.charge_state?.battery_level ?? '--'}%
                              </span>
                              <span className="stat-label">Battery</span>
                            </div>
                            <div className="stat-extra">
                              {formatRange(details.charge_state?.battery_range)}
                            </div>
                          </div>

                          {/* Charge Status */}
                          <div className="summary-stat-card">
                            <div className={`stat-icon charging ${details.charge_state?.charging_state === 'Charging' ? 'active' : ''}`}>
                              <BsLightningCharge size={20} />
                            </div>
                            <div className="stat-content">
                              <span className="stat-value">
                                {details.charge_state?.charging_state || 'Not Plugged In'}
                              </span>
                              <span className="stat-label">Charge Status</span>
                            </div>
                            {details.charge_state?.charging_state === 'Charging' && (
                              <div className="stat-extra">
                                +{details.charge_state?.charge_rate || 0} mi/hr
                              </div>
                            )}
                          </div>

                          {/* Climate */}
                          <div className="summary-stat-card">
                            <div className={`stat-icon climate ${details.climate_state?.is_climate_on ? 'active' : ''}`}>
                              <BsThermometerHalf size={20} />
                            </div>
                            <div className="stat-content">
                              <span className="stat-value">
                                {formatTemperature(details.climate_state?.inside_temp)}
                              </span>
                              <span className="stat-label">Inside Temp</span>
                            </div>
                            <div className="stat-extra">
                              {details.climate_state?.is_climate_on ? 'Climate On' : 'Climate Off'}
                            </div>
                          </div>

                          {/* Lock Status */}
                          <div className="summary-stat-card">
                            <div className={`stat-icon lock ${details.vehicle_state?.locked ? 'locked' : 'unlocked'}`}>
                              {details.vehicle_state?.locked ? <FiLock size={20} /> : <FiUnlock size={20} />}
                            </div>
                            <div className="stat-content">
                              <span className="stat-value">
                                {details.vehicle_state?.locked ? 'Locked' : 'Unlocked'}
                              </span>
                              <span className="stat-label">Security</span>
                            </div>
                            <div className="stat-extra">
                              {details.vehicle_state?.sentry_mode ? 'Sentry On' : 'Sentry Off'}
                            </div>
                          </div>

                          {/* Location */}
                          <div className="summary-stat-card">
                            <div className="stat-icon location">
                              <FiMapPin size={20} />
                            </div>
                            <div className="stat-content">
                              <span className="stat-value location-text">
                                {details.drive_state?.shift_state || 'Parked'}
                              </span>
                              <span className="stat-label">Location Status</span>
                            </div>
                            <div className="stat-extra">
                              {details.drive_state?.speed ? `${details.drive_state.speed} mph` : 'Stationary'}
                            </div>
                          </div>

                          {/* Software */}
                          <div className="summary-stat-card">
                            <div className="stat-icon software">
                              <FiZap size={20} />
                            </div>
                            <div className="stat-content">
                              <span className="stat-value small-text">
                                {details.vehicle_state?.car_version?.split(' ')[0] || '--'}
                              </span>
                              <span className="stat-label">Software Verson</span>
                            </div>
                            {details.vehicle_state?.software_update?.status === 'available' && (
                              <div className="stat-extra highlight">Update Available</div>
                            )}
                          </div>
                        </div>

                        {/* Quick Info Bar */}
                        <div className="quick-info-bar">
                          <div className="quick-info-item">
                            <span className="quick-label">VIN:</span>
                            <span className="quick-value">{vehicle.vin}</span>
                          </div>
                          <div className="quick-info-item">
                            <span className="quick-label">Odometer:</span>
                            <span className="quick-value">
                              {details.vehicle_state?.odometer 
                                ? `${Math.round(details.vehicle_state.odometer).toLocaleString()} mi` 
                                : '--'}
                            </span>
                          </div>
                          <div className="quick-info-item">
                            <span className="quick-label">Charge Limit:</span>
                            <span className="quick-value">
                              {details.charge_state?.charge_limit_soc ?? '--'}%
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="vehicle-actions">
                          <button 
                            className="btn btn-primary view-details-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToDetails(vehicle.id);
                            }}
                          >
                            View Full Details & Controls
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="details-error">
                        <FiAlertCircle size={20} />
                        <span>Unable to load vehicle data. Vehicle may be asleep or offline.</span>
                        <button 
                          className="btn btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchVehicleDetails(vehicle.id);
                          }}
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
