import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService.jsx';
import VehicleCard from '../components/VehicleCard.jsx';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
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
    fetchVehicles();
  };

  const handleVehicleClick = (vehicleId) => {
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
          <p className="page-subtitle">Monitor your Tesla vehicles</p>
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

export default Dashboard;
