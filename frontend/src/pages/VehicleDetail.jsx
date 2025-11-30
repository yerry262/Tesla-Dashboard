import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService.jsx';
import BatteryCard from '../components/BatteryCard.jsx';
import ClimateCard from '../components/ClimateCard.jsx';
import LocationCard from '../components/LocationCard.jsx';
import VehicleStateCard from '../components/VehicleStateCard.jsx';
import ChargingCard from '../components/ChargingCard.jsx';
import { FiArrowLeft, FiRefreshCw, FiAlertCircle, FiPower } from 'react-icons/fi';
import './VehicleDetail.css';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waking, setWaking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicleData = useCallback(async () => {
    try {
      setError(null);
      const response = await vehicleService.getVehicleData(id);
      setVehicleData(response.response);
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      if (err.response?.data?.code === 'VEHICLE_ASLEEP') {
        setError('Vehicle is asleep. Click "Wake Up" to retrieve data.');
      } else {
        setError('Failed to load vehicle data. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  const handleWakeUp = async () => {
    setWaking(true);
    try {
      await vehicleService.wakeVehicle(id);
      // Wait a bit for vehicle to wake
      setTimeout(() => {
        fetchVehicleData();
        setWaking(false);
      }, 5000);
    } catch (err) {
      console.error('Error waking vehicle:', err);
      setError('Failed to wake vehicle. Please try again.');
      setWaking(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVehicleData();
  };

  if (loading) {
    return (
      <div className="vehicle-detail">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-detail">
      <div className="detail-header">
        <button className="btn btn-icon" onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </button>
        <div className="header-info">
          <h1 className="page-title">
            {vehicleData?.display_name || 'Tesla Vehicle'}
          </h1>
          <p className="page-subtitle">
            {vehicleData?.vin || `Vehicle ID: ${id}`}
          </p>
        </div>
        <div className="header-actions">
          {error?.includes('asleep') && (
            <button 
              className={`btn btn-primary ${waking ? 'loading' : ''}`}
              onClick={handleWakeUp}
              disabled={waking}
            >
              <FiPower size={18} />
              {waking ? 'Waking...' : 'Wake Up'}
            </button>
          )}
          <button 
            className={`btn btn-secondary ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing || waking}
          >
            <FiRefreshCw size={18} className={refreshing ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <FiAlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {vehicleData && (
        <div className="detail-grid">
          <BatteryCard data={vehicleData.charge_state} />
          <ClimateCard data={vehicleData.climate_state} />
          <LocationCard data={vehicleData.drive_state} />
          <VehicleStateCard data={vehicleData.vehicle_state} />
          <ChargingCard 
            chargeState={vehicleData.charge_state}
            vehicleId={id}
          />
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;
