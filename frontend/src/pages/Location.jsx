import React, { useState, useEffect } from 'react';
import vehicleService from '../services/vehicleService.jsx';
import { FiMapPin, FiNavigation, FiClock } from 'react-icons/fi';
import './Location.css';

const Location = () => {
  const [vehicles, setVehicles] = useState([]);
  const [locationData, setLocationData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehicleService.getVehicles();
      // API returns { response: [...vehicles] }
      const vehicleList = response.response || response || [];
      setVehicles(vehicleList);

      // Fetch detailed data for online vehicles
      const locations = {};
      for (const vehicle of vehicleList) {
        if (vehicle.state === 'online') {
          try {
            const vehicleData = await vehicleService.getVehicleData(vehicle.id);
            // API returns { response: { drive_state: {...} } }
            const data = vehicleData.response || vehicleData;
            locations[vehicle.id] = data.drive_state || {};
          } catch (e) {
            console.error(`Failed to get data for ${vehicle.display_name}:`, e);
            locations[vehicle.id] = null;
          }
        }
      }
      setLocationData(locations);
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError('Failed to load location information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const openInMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  if (loading) {
    return (
      <div className="location-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading location information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="location-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchLocationData} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="location-page">
      <div className="page-header">
        <div>
          <h1>Vehicle Locations</h1>
          <p className="subtitle">Track where your vehicles are located</p>
        </div>
        <button onClick={fetchLocationData} className="refresh-btn">🔄 Refresh</button>
      </div>

      <div className="location-grid">
        {vehicles.map((vehicle) => {
          const driveState = locationData[vehicle.id];
          
          return (
            <div key={vehicle.id} className="location-card">
              <div className="location-card-header">
                <h3>{vehicle.display_name}</h3>
                <span className={`status-badge ${vehicle.state}`}>
                  {vehicle.state}
                </span>
              </div>

              {vehicle.state !== 'online' ? (
                <div className="vehicle-offline">
                  <FiMapPin size={48} />
                  <p>Vehicle is {vehicle.state}</p>
                  <small>Wake the vehicle to see location</small>
                </div>
              ) : driveState && driveState.latitude ? (
                <div className="location-details">
                  <div className="location-map-placeholder" onClick={() => openInMaps(driveState.latitude, driveState.longitude)}>
                    <FiMapPin size={32} />
                    <span>Click to open in Google Maps</span>
                  </div>

                  <div className="location-info">
                    <div className="info-row">
                      <FiMapPin size={16} />
                      <span>
                        {driveState.latitude?.toFixed(6)}, {driveState.longitude?.toFixed(6)}
                      </span>
                    </div>

                    <div className="info-row">
                      <FiNavigation size={16} />
                      <span>
                        Heading: {driveState.heading || 0}° 
                        {driveState.speed ? ` • ${driveState.speed} mph` : ' • Parked'}
                      </span>
                    </div>

                    <div className="info-row">
                      <FiClock size={16} />
                      <span>Updated: {formatTimestamp(driveState.gps_as_of)}</span>
                    </div>
                  </div>

                  <button 
                    className="maps-btn"
                    onClick={() => openInMaps(driveState.latitude, driveState.longitude)}
                  >
                    Open in Google Maps
                  </button>
                </div>
              ) : (
                <div className="vehicle-offline">
                  <FiMapPin size={48} />
                  <p>Location data unavailable</p>
                  <small>
                    {driveState === null 
                      ? 'Failed to fetch vehicle data' 
                      : 'Location sharing may be disabled or requires firmware 2023.38+'}
                  </small>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Location;
