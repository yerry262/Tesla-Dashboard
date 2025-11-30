import React from 'react';
import { FiBattery, FiBatteryCharging, FiZap } from 'react-icons/fi';
import './Cards.css';

const BatteryCard = ({ data }) => {
  if (!data) {
    return (
      <div className="info-card card">
        <div className="card-header">
          <h3 className="card-title">
            <FiBattery size={20} />
            Battery
          </h3>
        </div>
        <div className="card-body">
          <p className="no-data">No battery data available</p>
        </div>
      </div>
    );
  }

  const batteryLevel = data.battery_level || 0;
  const batteryRange = data.battery_range || 0;
  const isCharging = data.charging_state === 'Charging';
  const chargeLimit = data.charge_limit_soc || 80;

  const getBatteryColor = () => {
    if (batteryLevel >= 60) return 'success';
    if (batteryLevel >= 20) return 'warning';
    return 'error';
  };

  return (
    <div className="info-card card">
      <div className="card-header">
        <h3 className="card-title">
          {isCharging ? <FiBatteryCharging size={20} /> : <FiBattery size={20} />}
          Battery
        </h3>
        {isCharging && (
          <span className="badge badge-success">
            <FiZap size={12} />
            Charging
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="big-metric">
          <span className="metric-value">{batteryLevel}</span>
          <span className="metric-unit">%</span>
        </div>

        <div className="battery-bar">
          <div 
            className={`battery-fill ${getBatteryColor()}`}
            style={{ width: `${batteryLevel}%` }}
          />
          <div 
            className="charge-limit-marker"
            style={{ left: `${chargeLimit}%` }}
          />
        </div>

        <div className="metric-row">
          <div className="metric-item">
            <span className="metric-label">Range</span>
            <span className="metric-value-sm">
              {Math.round(batteryRange)} <span className="metric-unit-sm">mi</span>
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Charge Limit</span>
            <span className="metric-value-sm">
              {chargeLimit} <span className="metric-unit-sm">%</span>
            </span>
          </div>
        </div>

        {isCharging && (
          <div className="charging-info">
            <div className="metric-item">
              <span className="metric-label">Time to Full</span>
              <span className="metric-value-sm">
                {data.time_to_full_charge ? 
                  `${Math.floor(data.time_to_full_charge)}h ${Math.round((data.time_to_full_charge % 1) * 60)}m` 
                  : '--'}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Charge Rate</span>
              <span className="metric-value-sm">
                {data.charge_rate || 0} <span className="metric-unit-sm">mi/hr</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatteryCard;
