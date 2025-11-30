import React from 'react';
import { FiBattery, FiMapPin, FiWifi, FiWifiOff } from 'react-icons/fi';
import './VehicleCard.css';

const VehicleCard = ({ vehicle, onClick }) => {
  const isOnline = vehicle.state === 'online';
  const isAsleep = vehicle.state === 'asleep';

  const getStateLabel = () => {
    switch (vehicle.state) {
      case 'online': return 'Online';
      case 'asleep': return 'Asleep';
      case 'offline': return 'Offline';
      default: return vehicle.state;
    }
  };

  const getStateClass = () => {
    switch (vehicle.state) {
      case 'online': return 'success';
      case 'asleep': return 'warning';
      case 'offline': return 'error';
      default: return '';
    }
  };

  return (
    <div className="vehicle-card card" onClick={onClick}>
      <div className="vehicle-card-header">
        <div className="vehicle-info">
          <h3 className="vehicle-name">{vehicle.display_name || 'Tesla Vehicle'}</h3>
          <p className="vehicle-vin">VIN: {vehicle.vin}</p>
        </div>
        <div className={`vehicle-status badge badge-${getStateClass()}`}>
          {isOnline ? <FiWifi size={14} /> : <FiWifiOff size={14} />}
          {getStateLabel()}
        </div>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-image">
          <span className="vehicle-emoji">🚗</span>
        </div>

        <div className="vehicle-quick-stats">
          <div className="quick-stat">
            <FiBattery size={18} />
            <span>--</span>
          </div>
          <div className="quick-stat">
            <FiMapPin size={18} />
            <span>--</span>
          </div>
        </div>
      </div>

      <div className="vehicle-card-footer">
        <span className="vehicle-model">
          {vehicle.vehicle_config?.car_type?.replace(/_/g, ' ').toUpperCase() || 'Model Y'}
        </span>
        {isAsleep && (
          <span className="tap-hint">Tap to wake & view details</span>
        )}
        {isOnline && (
          <span className="tap-hint">Tap for details</span>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
