import React, { useState, useEffect } from 'react';
import vehicleService from '../services/vehicleService.jsx';
import { FiBattery, FiZap, FiClock, FiTrendingUp } from 'react-icons/fi';
import './Charging.css';

const Charging = () => {
  const [vehicles, setVehicles] = useState([]);
  const [chargingData, setChargingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChargingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehicleService.getVehicles();
      // API returns { response: [...vehicles] }
      const vehicleList = response.response || response || [];
      setVehicles(vehicleList);

      // Fetch detailed data for online vehicles
      const chargingInfo = {};
      for (const vehicle of vehicleList) {
        if (vehicle.state === 'online') {
          try {
            const vehicleData = await vehicleService.getVehicleData(vehicle.id);
            // API returns { response: { charge_state: {...} } }
            const data = vehicleData.response || vehicleData;
            chargingInfo[vehicle.id] = data.charge_state || {};
          } catch (e) {
            console.error(`Failed to get data for ${vehicle.display_name}:`, e);
            chargingInfo[vehicle.id] = null;
          }
        }
      }
      setChargingData(chargingInfo);
    } catch (err) {
      console.error('Error fetching charging data:', err);
      setError('Failed to load charging information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargingData();
  }, []);

  const getChargingStatus = (chargeState) => {
    if (!chargeState) return { status: 'Unknown', color: 'gray' };
    if (chargeState.charging_state === 'Charging') return { status: 'Charging', color: '#22c55e' };
    if (chargeState.charging_state === 'Complete') return { status: 'Complete', color: '#3b82f6' };
    if (chargeState.charging_state === 'Disconnected') return { status: 'Not Plugged In', color: '#6b7280' };
    if (chargeState.charging_state === 'Stopped') return { status: 'Stopped', color: '#f59e0b' };
    return { status: chargeState.charging_state || 'Unknown', color: '#6b7280' };
  };

  if (loading) {
    return (
      <div className="charging-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading charging information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="charging-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchChargingData} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="charging-page">
      <div className="page-header">
        <div>
          <h1>Charging Status</h1>
          <p className="subtitle">Monitor charging for all your vehicles</p>
        </div>
        <button onClick={fetchChargingData} className="refresh-btn">🔄 Refresh</button>
      </div>

      <div className="charging-grid">
        {vehicles.map((vehicle) => {
          const chargeState = chargingData[vehicle.id];
          const { status, color } = getChargingStatus(chargeState);
          
          return (
            <div key={vehicle.id} className="charging-card">
              <div className="charging-card-header">
                <h3>{vehicle.display_name}</h3>
                <span 
                  className="charging-status-badge"
                  style={{ backgroundColor: color }}
                >
                  {status}
                </span>
              </div>

              {vehicle.state !== 'online' ? (
                <div className="vehicle-offline">
                  <p>Vehicle is {vehicle.state}</p>
                  <small>Wake the vehicle to see charging data</small>
                </div>
              ) : chargeState ? (
                <div className="charging-details">
                  <div className="charge-level">
                    <div className="battery-visual">
                      <div 
                        className="battery-fill"
                        style={{ 
                          width: `${chargeState.battery_level || 0}%`,
                          backgroundColor: (chargeState.battery_level || 0) > 20 ? '#22c55e' : '#ef4444'
                        }}
                      />
                    </div>
                    <span className="battery-percent">{chargeState.battery_level || 0}%</span>
                  </div>

                  <div className="charging-stats">
                    <div className="stat">
                      <FiBattery size={18} />
                      <div>
                        <span className="stat-value">{chargeState.battery_range?.toFixed(0) || '--'} mi</span>
                        <span className="stat-label">Range</span>
                      </div>
                    </div>

                    <div className="stat">
                      <FiTrendingUp size={18} />
                      <div>
                        <span className="stat-value">{chargeState.charge_limit_soc || '--'}%</span>
                        <span className="stat-label">Charge Limit</span>
                      </div>
                    </div>

                    {chargeState.charging_state === 'Charging' && (
                      <>
                        <div className="stat">
                          <FiZap size={18} />
                          <div>
                            <span className="stat-value">{chargeState.charge_rate || 0} mph</span>
                            <span className="stat-label">Charge Rate</span>
                          </div>
                        </div>

                        <div className="stat">
                          <FiClock size={18} />
                          <div>
                            <span className="stat-value">
                              {chargeState.time_to_full_charge 
                                ? `${Math.floor(chargeState.time_to_full_charge)}h ${Math.round((chargeState.time_to_full_charge % 1) * 60)}m`
                                : '--'
                              }
                            </span>
                            <span className="stat-label">Time to Full</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="vehicle-offline">
                  <p>Unable to fetch charging data</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Charging;
