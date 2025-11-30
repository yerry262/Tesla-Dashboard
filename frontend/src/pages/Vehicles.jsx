import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService.jsx';
import VehicleCard from '../components/VehicleCard.jsx';
import './Dashboard.css';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehicleService.getVehicles();
      // API returns { response: [...vehicles] }
      setVehicles(response.response || response || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleVehicleClick = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}`);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchVehicles} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>All Vehicles</h1>
          <p className="subtitle">Manage and view all your Tesla vehicles</p>
        </div>
        <button onClick={fetchVehicles} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="no-vehicles">
          <p>No vehicles found. Make sure your Tesla account is linked.</p>
        </div>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => handleVehicleClick(vehicle.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
