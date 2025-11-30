import React, { useState, useEffect, useCallback } from 'react';
import { FiZap, FiMapPin } from 'react-icons/fi';
import vehicleService from '../services/vehicleService.jsx';
import './Cards.css';

const ChargingCard = ({ chargeState, vehicleId }) => {
  const [nearbyChargers, setNearbyChargers] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNearbyChargers = useCallback(async () => {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const response = await vehicleService.getNearbyChargingSites(vehicleId);
      setNearbyChargers(response.response);
    } catch (error) {
      console.error('Error fetching nearby chargers:', error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchNearbyChargers();
  }, [fetchNearbyChargers]);

  const isCharging = chargeState?.charging_state === 'Charging';
  const chargerType = chargeState?.fast_charger_type;
  const chargerPower = chargeState?.charger_power || 0;

  return (
    <div className="info-card card charging-card">
      <div className="card-header">
        <h3 className="card-title">
          <FiZap size={20} />
          Charging
        </h3>
        {isCharging && (
          <span className="badge badge-success">
            <FiZap size={12} />
            {chargerType || 'Charging'}
          </span>
        )}
      </div>

      <div className="card-body">
        {isCharging ? (
          <div className="charging-active">
            <div className="big-metric">
              <span className="metric-value">{chargerPower}</span>
              <span className="metric-unit">kW</span>
            </div>
            <div className="metric-row">
              <div className="metric-item">
                <span className="metric-label">Voltage</span>
                <span className="metric-value-sm">
                  {chargeState?.charger_voltage || 0} <span className="metric-unit-sm">V</span>
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Current</span>
                <span className="metric-value-sm">
                  {chargeState?.charger_actual_current || 0} <span className="metric-unit-sm">A</span>
                </span>
              </div>
            </div>
            <div className="metric-row">
              <div className="metric-item">
                <span className="metric-label">Energy Added</span>
                <span className="metric-value-sm">
                  {chargeState?.charge_energy_added?.toFixed(1) || 0} <span className="metric-unit-sm">kWh</span>
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Miles Added</span>
                <span className="metric-value-sm">
                  {chargeState?.charge_miles_added_rated?.toFixed(1) || 0} <span className="metric-unit-sm">mi</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="not-charging">
            <p className="charging-status">
              {chargeState?.charging_state || 'Not Connected'}
            </p>
          </div>
        )}

        <div className="nearby-chargers">
          <h4 className="subsection-title">
            <FiMapPin size={16} />
            Nearby Superchargers
          </h4>
          
          {loading ? (
            <p className="loading-text">Loading nearby chargers...</p>
          ) : nearbyChargers?.superchargers?.length > 0 ? (
            <div className="charger-list">
              {nearbyChargers.superchargers.slice(0, 3).map((charger, index) => (
                <div key={index} className="charger-item">
                  <div className="charger-info">
                    <span className="charger-name">{charger.name}</span>
                    <span className="charger-distance">
                      {(charger.distance_miles || 0).toFixed(1)} mi away
                    </span>
                  </div>
                  <div className="charger-availability">
                    <span className={`stall-count ${charger.available_stalls > 0 ? 'available' : 'full'}`}>
                      {charger.available_stalls || 0}/{charger.total_stalls || 0}
                    </span>
                    <span className="stall-label">stalls</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No nearby Superchargers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChargingCard;
