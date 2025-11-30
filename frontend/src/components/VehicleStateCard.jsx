import React from 'react';
import { FiTruck, FiLock, FiUnlock, FiAlertTriangle } from 'react-icons/fi';
import './Cards.css';

const VehicleStateCard = ({ data }) => {
  if (!data) {
    return (
      <div className="info-card card">
        <div className="card-header">
          <h3 className="card-title">
            <FiTruck size={20} />
            Vehicle State
          </h3>
        </div>
        <div className="card-body">
          <p className="no-data">No vehicle state data available</p>
        </div>
      </div>
    );
  }

  const isLocked = data.locked;
  const odometer = data.odometer ? Math.round(data.odometer) : 0;
  const softwareVersion = data.car_version || 'Unknown';
  const sentryMode = data.sentry_mode;

  return (
    <div className="info-card card">
      <div className="card-header">
        <h3 className="card-title">
          <FiTruck size={20} />
          Vehicle State
        </h3>
        <span className={`badge ${isLocked ? 'badge-success' : 'badge-warning'}`}>
          {isLocked ? <FiLock size={12} /> : <FiUnlock size={12} />}
          {isLocked ? 'Locked' : 'Unlocked'}
        </span>
      </div>

      <div className="card-body">
        <div className="state-grid">
          <div className="state-item">
            <span className="state-label">Odometer</span>
            <span className="state-value">
              {odometer.toLocaleString()} <span className="metric-unit-sm">mi</span>
            </span>
          </div>
          <div className="state-item">
            <span className="state-label">Sentry Mode</span>
            <span className={`state-value ${sentryMode ? 'active' : ''}`}>
              {sentryMode ? 'Active' : 'Off'}
            </span>
          </div>
        </div>

        <div className="software-version">
          <span className="metric-label">Software Version</span>
          <span className="version-text">{softwareVersion.split(' ')[0]}</span>
        </div>

        <div className="door-status">
          <span className="metric-label">Doors & Trunk</span>
          <div className="door-grid">
            <div className={`door-item ${data.df ? 'open' : ''}`}>
              <span>Front Left</span>
              <span className="door-state">{data.df ? 'Open' : 'Closed'}</span>
            </div>
            <div className={`door-item ${data.pf ? 'open' : ''}`}>
              <span>Front Right</span>
              <span className="door-state">{data.pf ? 'Open' : 'Closed'}</span>
            </div>
            <div className={`door-item ${data.dr ? 'open' : ''}`}>
              <span>Rear Left</span>
              <span className="door-state">{data.dr ? 'Open' : 'Closed'}</span>
            </div>
            <div className={`door-item ${data.pr ? 'open' : ''}`}>
              <span>Rear Right</span>
              <span className="door-state">{data.pr ? 'Open' : 'Closed'}</span>
            </div>
            <div className={`door-item ${data.ft ? 'open' : ''}`}>
              <span>Frunk</span>
              <span className="door-state">{data.ft ? 'Open' : 'Closed'}</span>
            </div>
            <div className={`door-item ${data.rt ? 'open' : ''}`}>
              <span>Trunk</span>
              <span className="door-state">{data.rt ? 'Open' : 'Closed'}</span>
            </div>
          </div>
        </div>

        {(data.df || data.pf || data.dr || data.pr || data.ft || data.rt) && (
          <div className="alert-banner">
            <FiAlertTriangle size={16} />
            <span>One or more doors are open</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleStateCard;
