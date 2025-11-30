import React from 'react';
import { FiThermometer, FiSun, FiWind } from 'react-icons/fi';
import './Cards.css';

const ClimateCard = ({ data }) => {
  if (!data) {
    return (
      <div className="info-card card">
        <div className="card-header">
          <h3 className="card-title">
            <FiThermometer size={20} />
            Climate
          </h3>
        </div>
        <div className="card-body">
          <p className="no-data">No climate data available</p>
        </div>
      </div>
    );
  }

  const insideTemp = data.inside_temp ? Math.round((data.inside_temp * 9/5) + 32) : null;
  const outsideTemp = data.outside_temp ? Math.round((data.outside_temp * 9/5) + 32) : null;
  const isClimateOn = data.is_climate_on;

  return (
    <div className="info-card card">
      <div className="card-header">
        <h3 className="card-title">
          <FiThermometer size={20} />
          Climate
        </h3>
        {isClimateOn && (
          <span className="badge badge-info">
            <FiWind size={12} />
            Active
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="temp-display">
          <div className="temp-item">
            <FiSun size={24} className="temp-icon outside" />
            <div>
              <span className="temp-label">Outside</span>
              <span className="temp-value">
                {outsideTemp !== null ? `${outsideTemp}°F` : '--'}
              </span>
            </div>
          </div>
          <div className="temp-divider" />
          <div className="temp-item">
            <FiThermometer size={24} className="temp-icon inside" />
            <div>
              <span className="temp-label">Inside</span>
              <span className="temp-value">
                {insideTemp !== null ? `${insideTemp}°F` : '--'}
              </span>
            </div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-item">
            <span className="metric-label">Driver Temp</span>
            <span className="metric-value-sm">
              {data.driver_temp_setting ? 
                `${Math.round((data.driver_temp_setting * 9/5) + 32)}°F` 
                : '--'}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Passenger Temp</span>
            <span className="metric-value-sm">
              {data.passenger_temp_setting ? 
                `${Math.round((data.passenger_temp_setting * 9/5) + 32)}°F` 
                : '--'}
            </span>
          </div>
        </div>

        <div className="climate-features">
          {data.seat_heater_left > 0 && (
            <span className="feature-badge">Driver Seat Heat</span>
          )}
          {data.seat_heater_right > 0 && (
            <span className="feature-badge">Passenger Seat Heat</span>
          )}
          {data.is_preconditioning && (
            <span className="feature-badge">Preconditioning</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClimateCard;
