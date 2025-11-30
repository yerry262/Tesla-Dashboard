import React from 'react';
import { FiMapPin, FiNavigation, FiClock } from 'react-icons/fi';
import './Cards.css';

const LocationCard = ({ data }) => {
  if (!data) {
    return (
      <div className="info-card card">
        <div className="card-header">
          <h3 className="card-title">
            <FiMapPin size={20} />
            Location
          </h3>
        </div>
        <div className="card-body">
          <p className="no-data">No location data available</p>
        </div>
      </div>
    );
  }

  const latitude = data.latitude;
  const longitude = data.longitude;
  const heading = data.heading;
  const speed = data.speed ? Math.round(data.speed) : 0;
  const isDriving = data.shift_state && data.shift_state !== 'P';

  const getCompassDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const openInMaps = () => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }
  };

  return (
    <div className="info-card card">
      <div className="card-header">
        <h3 className="card-title">
          <FiMapPin size={20} />
          Location
        </h3>
        {isDriving && (
          <span className="badge badge-info">
            <FiNavigation size={12} />
            Driving
          </span>
        )}
      </div>

      <div className="card-body">
        {latitude && longitude ? (
          <>
            <div className="location-preview" onClick={openInMaps}>
              <div className="map-placeholder">
                <FiMapPin size={32} />
                <span>Click to view on map</span>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-item">
                <span className="metric-label">Coordinates</span>
                <span className="metric-value-sm coords">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-item">
                <span className="metric-label">Heading</span>
                <span className="metric-value-sm">
                  {heading ? `${heading}° ${getCompassDirection(heading)}` : '--'}
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Speed</span>
                <span className="metric-value-sm">
                  {speed} <span className="metric-unit-sm">mph</span>
                </span>
              </div>
            </div>

            {data.gps_as_of && (
              <div className="location-timestamp">
                <FiClock size={14} />
                Updated: {new Date(data.gps_as_of * 1000).toLocaleTimeString()}
              </div>
            )}
          </>
        ) : (
          <p className="no-data">Location data not available</p>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
