import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService.jsx';
import { 
  FiArrowLeft, FiRefreshCw, FiAlertCircle, FiPower, FiLock, FiUnlock,
  FiBattery, FiThermometer, FiMapPin, FiZap, FiWind, FiSun, FiMoon,
  FiVolume2, FiSkipForward, FiSkipBack, FiPlay, FiPause,
  FiNavigation, FiHome, FiSettings, FiShield, FiAlertTriangle,
  FiChevronDown, FiChevronUp, FiCheck, FiX, FiActivity, FiHeart
} from 'react-icons/fi';
import { 
  BsLightningCharge, BsThermometerHalf, BsSnow, BsSpeedometer,
  BsDoorOpen, BsCarFront, BsEvStation, BsGear, BsBatteryFull
} from 'react-icons/bs';
import { IoCarSport } from 'react-icons/io5';
import './VehicleDetail.css';

// EPA range data by car type (miles) - original factory range at 100%
const EPA_RANGE_DATA = {
  'models': { range: 405, battery_kwh: 100 },  // Model S Long Range
  'modelx': { range: 348, battery_kwh: 100 },  // Model X Long Range
  'model3': { range: 333, battery_kwh: 82 },   // Model 3 Long Range
  'modely': { range: 330, battery_kwh: 82 },   // Model Y Long Range
  'models2': { range: 375, battery_kwh: 95 },  // Model S (older)
  'modelx2': { range: 315, battery_kwh: 95 },  // Model X (older)
  'cybertruck': { range: 340, battery_kwh: 123 }, // Cybertruck
  // Add more variants as needed
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waking, setWaking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [actionFeedback, setActionFeedback] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    climate: true,
    charging: true,
    batteryHealth: true,
    security: true,
    controls: false,
    software: false
  });
  const [tempSettings, setTempSettings] = useState({ driver: 70, passenger: 70 });
  const [chargeLimit, setChargeLimit] = useState(80);

  const fetchVehicleData = useCallback(async () => {
    try {
      setError(null);
      const response = await vehicleService.getVehicleData(id);
      setVehicleData(response.response);
      if (response.response?.charge_state?.charge_limit_soc) {
        setChargeLimit(response.response.charge_state.charge_limit_soc);
      }
      if (response.response?.climate_state?.driver_temp_setting) {
        setTempSettings({
          driver: Math.round((response.response.climate_state.driver_temp_setting * 9/5) + 32),
          passenger: Math.round((response.response.climate_state.passenger_temp_setting * 9/5) + 32)
        });
      }
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

  const executeCommand = async (commandName, commandFn) => {
    setActionLoading(prev => ({ ...prev, [commandName]: true }));
    setActionFeedback(prev => ({ ...prev, [commandName]: null }));
    
    try {
      await commandFn();
      setActionFeedback(prev => ({ ...prev, [commandName]: 'success' }));
      setTimeout(() => {
        setActionFeedback(prev => ({ ...prev, [commandName]: null }));
        fetchVehicleData(); // Refresh data
      }, 1500);
    } catch (err) {
      console.error(`Error executing ${commandName}:`, err);
      setActionFeedback(prev => ({ ...prev, [commandName]: 'error' }));
      setTimeout(() => {
        setActionFeedback(prev => ({ ...prev, [commandName]: null }));
      }, 3000);
    } finally {
      setActionLoading(prev => ({ ...prev, [commandName]: false }));
    }
  };

  const handleWakeUp = async () => {
    setWaking(true);
    try {
      await vehicleService.wakeVehicle(id);
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatTemperature = (celsius) => {
    if (celsius == null) return '--';
    const fahrenheit = (celsius * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  };

  const formatRange = (miles) => {
    if (miles == null) return '--';
    return `${Math.round(miles)} mi`;
  };

  // Battery health calculations
  const getBatteryHealthData = () => {
    const chargeState = vehicleData?.charge_state;
    const vehicleConfig = vehicleData?.vehicle_config;
    
    if (!chargeState) return null;

    const batteryLevel = chargeState.battery_level || 0;
    const usableBatteryLevel = chargeState.usable_battery_level || batteryLevel;
    const idealRange = chargeState.ideal_battery_range || 0;
    const estRange = chargeState.est_battery_range || 0;
    const ratedRange = chargeState.battery_range || 0;
    
    // Get car type for EPA lookup
    const carType = vehicleConfig?.car_type?.toLowerCase() || 'model3';
    const epaData = EPA_RANGE_DATA[carType] || EPA_RANGE_DATA['model3'];
    
    // Calculate full range at 100% (extrapolated from current data)
    const fullIdealRange = batteryLevel > 0 ? (idealRange / batteryLevel) * 100 : 0;
    const fullEstRange = batteryLevel > 0 ? (estRange / batteryLevel) * 100 : 0;
    const fullRatedRange = batteryLevel > 0 ? (ratedRange / batteryLevel) * 100 : 0;
    
    // Battery health estimate (based on ideal range vs EPA)
    const batteryHealthPercent = epaData.range > 0 ? Math.min(100, (fullIdealRange / epaData.range) * 100) : 0;
    
    // Estimated current kWh capacity
    const estimatedCurrentKwh = (batteryHealthPercent / 100) * epaData.battery_kwh;
    
    // Energy in battery right now
    const currentEnergyKwh = (batteryLevel / 100) * estimatedCurrentKwh;
    
    // Degradation
    const degradationPercent = 100 - batteryHealthPercent;
    
    return {
      batteryLevel,
      usableBatteryLevel,
      idealRange: Math.round(idealRange),
      estRange: Math.round(estRange),
      ratedRange: Math.round(ratedRange),
      fullIdealRange: Math.round(fullIdealRange),
      fullEstRange: Math.round(fullEstRange),
      fullRatedRange: Math.round(fullRatedRange),
      epaRange: epaData.range,
      originalKwh: epaData.battery_kwh,
      estimatedCurrentKwh: estimatedCurrentKwh.toFixed(1),
      currentEnergyKwh: currentEnergyKwh.toFixed(1),
      batteryHealthPercent: batteryHealthPercent.toFixed(1),
      degradationPercent: degradationPercent.toFixed(1),
      carType: carType
    };
  };

  // Circular gauge component
  const CircularGauge = ({ value, max, label, unit, color = '#3b82f6', size = 120 }) => {
    const percentage = Math.min(100, (value / max) * 100);
    const circumference = 2 * Math.PI * 45; // radius of 45
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="circular-gauge" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="gauge-content">
          <span className="gauge-value">{value}{unit}</span>
          <span className="gauge-label">{label}</span>
        </div>
      </div>
    );
  };

  const getButtonClass = (commandName) => {
    let baseClass = 'control-btn';
    if (actionLoading[commandName]) baseClass += ' loading';
    if (actionFeedback[commandName] === 'success') baseClass += ' success';
    if (actionFeedback[commandName] === 'error') baseClass += ' error';
    return baseClass;
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

  const chargeState = vehicleData?.charge_state;
  const climateState = vehicleData?.climate_state;
  const vehicleState = vehicleData?.vehicle_state;
  const driveState = vehicleData?.drive_state;

  return (
    <div className="vehicle-detail">
      {/* Header */}
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
        <div className="detail-content">
          {/* Status Overview */}
          <div className="status-overview">
            <div className="status-card primary">
              <div className="status-icon">
                <FiBattery size={28} />
              </div>
              <div className="status-info">
                <span className="status-value">{chargeState?.battery_level ?? '--'}%</span>
                <span className="status-label">Battery</span>
                <span className="status-extra">{formatRange(chargeState?.battery_range)} range</span>
              </div>
            </div>
            <div className="status-card">
              <div className="status-icon">
                <BsThermometerHalf size={28} />
              </div>
              <div className="status-info">
                <span className="status-value">{formatTemperature(climateState?.inside_temp)}</span>
                <span className="status-label">Inside</span>
                <span className="status-extra">{formatTemperature(climateState?.outside_temp)} outside</span>
              </div>
            </div>
            <div className="status-card">
              <div className="status-icon">
                {vehicleState?.locked ? <FiLock size={28} /> : <FiUnlock size={28} />}
              </div>
              <div className="status-info">
                <span className="status-value">{vehicleState?.locked ? 'Locked' : 'Unlocked'}</span>
                <span className="status-label">Security</span>
                <span className="status-extra">{vehicleState?.sentry_mode ? 'Sentry On' : 'Sentry Off'}</span>
              </div>
            </div>
            <div className="status-card">
              <div className="status-icon">
                <FiMapPin size={28} />
              </div>
              <div className="status-info">
                <span className="status-value">{driveState?.shift_state || 'Parked'}</span>
                <span className="status-label">Status</span>
                <span className="status-extra">
                  {vehicleState?.odometer ? `${Math.round(vehicleState.odometer).toLocaleString()} mi` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Climate Section */}
          <div className="control-section">
            <div className="section-header" onClick={() => toggleSection('climate')}>
              <div className="section-title">
                <BsThermometerHalf size={20} />
                <span>Climate Control</span>
              </div>
              <div className="section-status">
                <span className={`status-badge ${climateState?.is_climate_on ? 'active' : ''}`}>
                  {climateState?.is_climate_on ? 'On' : 'Off'}
                </span>
                {expandedSections.climate ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.climate && (
              <div className="section-content">
                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Climate</span>
                    <span className="control-value">
                      {climateState?.is_climate_on ? `${formatTemperature(climateState?.driver_temp_setting)}` : 'Off'}
                    </span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={getButtonClass('startClimate')}
                      onClick={() => executeCommand('startClimate', () => vehicleService.startClimate(id))}
                      disabled={actionLoading['startClimate'] || climateState?.is_climate_on}
                    >
                      {actionLoading['startClimate'] ? '...' : 'Start'}
                    </button>
                    <button 
                      className={getButtonClass('stopClimate')}
                      onClick={() => executeCommand('stopClimate', () => vehicleService.stopClimate(id))}
                      disabled={actionLoading['stopClimate'] || !climateState?.is_climate_on}
                    >
                      {actionLoading['stopClimate'] ? '...' : 'Stop'}
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Climate Keeper</span>
                    <span className="control-value">
                      {climateState?.climate_keeper_mode === 'dog' ? 'Dog Mode' : 
                       climateState?.climate_keeper_mode === 'camp' ? 'Camp Mode' : 
                       climateState?.climate_keeper_mode === 'on' ? 'Keep On' : 'Off'}
                    </span>
                  </div>
                  <div className="control-actions multi">
                    <button 
                      className={`control-btn ${climateState?.climate_keeper_mode === 'dog' ? 'active' : ''}`}
                      onClick={() => executeCommand('dogMode', () => vehicleService.setClimateKeeperMode(id, 2))}
                    >
                      🐕 Dog
                    </button>
                    <button 
                      className={`control-btn ${climateState?.climate_keeper_mode === 'camp' ? 'active' : ''}`}
                      onClick={() => executeCommand('campMode', () => vehicleService.setClimateKeeperMode(id, 3))}
                    >
                      ⛺ Camp
                    </button>
                    <button 
                      className="control-btn"
                      onClick={() => executeCommand('climateOff', () => vehicleService.setClimateKeeperMode(id, 0))}
                    >
                      Off
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Seat Heaters</span>
                    <span className="control-value">Front Seats</span>
                  </div>
                  <div className="control-actions multi">
                    <div className="seat-controls">
                      <span>Driver:</span>
                      {[0, 1, 2, 3].map(level => (
                        <button 
                          key={`driver-${level}`}
                          className={`seat-btn ${climateState?.seat_heater_left === level ? 'active' : ''}`}
                          onClick={() => executeCommand(`seatDriver${level}`, () => vehicleService.setSeatHeater(id, 0, level))}
                        >
                          {level === 0 ? 'Off' : level}
                        </button>
                      ))}
                    </div>
                    <div className="seat-controls">
                      <span>Pass:</span>
                      {[0, 1, 2, 3].map(level => (
                        <button 
                          key={`pass-${level}`}
                          className={`seat-btn ${climateState?.seat_heater_right === level ? 'active' : ''}`}
                          onClick={() => executeCommand(`seatPass${level}`, () => vehicleService.setSeatHeater(id, 1, level))}
                        >
                          {level === 0 ? 'Off' : level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Steering Wheel Heater</span>
                    <span className="control-value">{climateState?.steering_wheel_heater ? 'On' : 'Off'}</span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={`control-btn toggle ${climateState?.steering_wheel_heater ? 'active' : ''}`}
                      onClick={() => executeCommand('steeringHeater', () => vehicleService.setSteeringWheelHeater(id, !climateState?.steering_wheel_heater))}
                    >
                      {climateState?.steering_wheel_heater ? 'Turn Off' : 'Turn On'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Charging Section */}
          <div className="control-section">
            <div className="section-header" onClick={() => toggleSection('charging')}>
              <div className="section-title">
                <BsLightningCharge size={20} />
                <span>Charging</span>
              </div>
              <div className="section-status">
                <span className={`status-badge ${chargeState?.charging_state === 'Charging' ? 'active' : ''}`}>
                  {chargeState?.charging_state || 'Not Connected'}
                </span>
                {expandedSections.charging ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.charging && (
              <div className="section-content">
                <div className="charging-stats">
                  <div className="stat-item">
                    <span className="stat-label">Battery</span>
                    <span className="stat-value">{chargeState?.battery_level ?? '--'}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Range</span>
                    <span className="stat-value">{formatRange(chargeState?.battery_range)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Charge Limit</span>
                    <span className="stat-value">{chargeState?.charge_limit_soc ?? '--'}%</span>
                  </div>
                  {chargeState?.charging_state === 'Charging' && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Charge Rate</span>
                        <span className="stat-value">{chargeState?.charge_rate ?? '--'} mi/hr</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Time to Full</span>
                        <span className="stat-value">{chargeState?.minutes_to_full_charge ?? '--'} min</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Charge Port</span>
                    <span className="control-value">{chargeState?.charge_port_door_open ? 'Open' : 'Closed'}</span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={getButtonClass('openPort')}
                      onClick={() => executeCommand('openPort', () => vehicleService.openChargePort(id))}
                      disabled={actionLoading['openPort']}
                    >
                      Open
                    </button>
                    <button 
                      className={getButtonClass('closePort')}
                      onClick={() => executeCommand('closePort', () => vehicleService.closeChargePort(id))}
                      disabled={actionLoading['closePort']}
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Charging</span>
                    <span className="control-value">{chargeState?.charging_state}</span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={getButtonClass('startCharge')}
                      onClick={() => executeCommand('startCharge', () => vehicleService.startCharging(id))}
                      disabled={actionLoading['startCharge']}
                    >
                      Start
                    </button>
                    <button 
                      className={getButtonClass('stopCharge')}
                      onClick={() => executeCommand('stopCharge', () => vehicleService.stopCharging(id))}
                      disabled={actionLoading['stopCharge']}
                    >
                      Stop
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Charge Limit</span>
                    <div className="slider-control">
                      <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        value={chargeLimit}
                        onChange={(e) => setChargeLimit(parseInt(e.target.value))}
                        className="slider"
                      />
                      <span className="slider-value">{chargeLimit}%</span>
                    </div>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={getButtonClass('setLimit')}
                      onClick={() => executeCommand('setLimit', () => vehicleService.setChargeLimit(id, chargeLimit))}
                      disabled={actionLoading['setLimit']}
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Battery Health Section */}
          <div className="control-section battery-health-section">
            <div className="section-header" onClick={() => toggleSection('batteryHealth')}>
              <div className="section-title">
                <FiHeart size={20} />
                <span>Battery Health & Stats</span>
              </div>
              <div className="section-status">
                {getBatteryHealthData() && (
                  <span className={`status-badge ${parseFloat(getBatteryHealthData()?.batteryHealthPercent) > 90 ? 'active' : parseFloat(getBatteryHealthData()?.batteryHealthPercent) > 80 ? '' : 'warning'}`}>
                    {getBatteryHealthData()?.batteryHealthPercent}% Health
                  </span>
                )}
                {expandedSections.batteryHealth ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.batteryHealth && getBatteryHealthData() && (
              <div className="section-content">
                {/* Main Gauges Row */}
                <div className="battery-gauges">
                  <div className="gauge-container">
                    <CircularGauge 
                      value={getBatteryHealthData().batteryLevel} 
                      max={100} 
                      label="Charge" 
                      unit="%" 
                      color="#22c55e"
                      size={130}
                    />
                    <span className="gauge-subtitle">Current Level</span>
                  </div>
                  <div className="gauge-container">
                    <CircularGauge 
                      value={parseFloat(getBatteryHealthData().batteryHealthPercent)} 
                      max={100} 
                      label="Health" 
                      unit="%" 
                      color={parseFloat(getBatteryHealthData().batteryHealthPercent) > 90 ? '#22c55e' : parseFloat(getBatteryHealthData().batteryHealthPercent) > 80 ? '#f59e0b' : '#ef4444'}
                      size={130}
                    />
                    <span className="gauge-subtitle">Battery Health</span>
                  </div>
                  <div className="gauge-container">
                    <CircularGauge 
                      value={parseFloat(getBatteryHealthData().currentEnergyKwh)} 
                      max={parseFloat(getBatteryHealthData().estimatedCurrentKwh)} 
                      label="kWh" 
                      unit="" 
                      color="#3b82f6"
                      size={130}
                    />
                    <span className="gauge-subtitle">Energy Available</span>
                  </div>
                </div>

                {/* Battery Stats Grid */}
                <div className="battery-stats-grid">
                  <div className="battery-stat-card">
                    <div className="stat-header">
                      <BsBatteryFull size={18} />
                      <span>Pack Capacity</span>
                    </div>
                    <div className="stat-body">
                      <div className="stat-row">
                        <span>Original Capacity</span>
                        <span className="stat-value">{getBatteryHealthData().originalKwh} kWh</span>
                      </div>
                      <div className="stat-row">
                        <span>Estimated Current</span>
                        <span className="stat-value">{getBatteryHealthData().estimatedCurrentKwh} kWh</span>
                      </div>
                      <div className="stat-row">
                        <span>Energy Right Now</span>
                        <span className="stat-value highlight">{getBatteryHealthData().currentEnergyKwh} kWh</span>
                      </div>
                    </div>
                  </div>

                  <div className="battery-stat-card">
                    <div className="stat-header">
                      <FiActivity size={18} />
                      <span>Degradation</span>
                    </div>
                    <div className="stat-body">
                      <div className="stat-row">
                        <span>Battery Health</span>
                        <span className="stat-value good">{getBatteryHealthData().batteryHealthPercent}%</span>
                      </div>
                      <div className="stat-row">
                        <span>Estimated Degradation</span>
                        <span className="stat-value">{getBatteryHealthData().degradationPercent}%</span>
                      </div>
                      <div className="stat-row">
                        <span>Usable vs Total</span>
                        <span className="stat-value">{getBatteryHealthData().usableBatteryLevel}% / {getBatteryHealthData().batteryLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Range Comparison */}
                <div className="range-comparison">
                  <h4 className="comparison-title">Range Analysis (at 100% charge)</h4>
                  <div className="range-bars">
                    <div className="range-bar-item">
                      <div className="range-bar-label">
                        <span>EPA Rated</span>
                        <span>{getBatteryHealthData().epaRange} mi</span>
                      </div>
                      <div className="range-bar-track">
                        <div 
                          className="range-bar-fill epa" 
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                    <div className="range-bar-item">
                      <div className="range-bar-label">
                        <span>Your Ideal Range</span>
                        <span>{getBatteryHealthData().fullIdealRange} mi</span>
                      </div>
                      <div className="range-bar-track">
                        <div 
                          className="range-bar-fill ideal" 
                          style={{ width: `${(getBatteryHealthData().fullIdealRange / getBatteryHealthData().epaRange) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="range-bar-item">
                      <div className="range-bar-label">
                        <span>Estimated Range</span>
                        <span>{getBatteryHealthData().fullEstRange} mi</span>
                      </div>
                      <div className="range-bar-track">
                        <div 
                          className="range-bar-fill estimated" 
                          style={{ width: `${(getBatteryHealthData().fullEstRange / getBatteryHealthData().epaRange) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="range-bar-item">
                      <div className="range-bar-label">
                        <span>Rated Range</span>
                        <span>{getBatteryHealthData().fullRatedRange} mi</span>
                      </div>
                      <div className="range-bar-track">
                        <div 
                          className="range-bar-fill rated" 
                          style={{ width: `${(getBatteryHealthData().fullRatedRange / getBatteryHealthData().epaRange) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Range Stats */}
                <div className="current-range-stats">
                  <div className="range-stat">
                    <span className="range-stat-label">Current Ideal</span>
                    <span className="range-stat-value">{getBatteryHealthData().idealRange} mi</span>
                  </div>
                  <div className="range-stat">
                    <span className="range-stat-label">Current Est.</span>
                    <span className="range-stat-value">{getBatteryHealthData().estRange} mi</span>
                  </div>
                  <div className="range-stat">
                    <span className="range-stat-label">Current Rated</span>
                    <span className="range-stat-value">{getBatteryHealthData().ratedRange} mi</span>
                  </div>
                  <div className="range-stat">
                    <span className="range-stat-label">Model</span>
                    <span className="range-stat-value">{getBatteryHealthData().carType.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="control-section">
            <div className="section-header" onClick={() => toggleSection('security')}>
              <div className="section-title">
                <FiShield size={20} />
                <span>Security & Access</span>
              </div>
              <div className="section-status">
                <span className={`status-badge ${vehicleState?.locked ? 'active' : 'warning'}`}>
                  {vehicleState?.locked ? 'Locked' : 'Unlocked'}
                </span>
                {expandedSections.security ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.security && (
              <div className="section-content">
                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Door Locks</span>
                    <span className="control-value">{vehicleState?.locked ? 'Locked' : 'Unlocked'}</span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={`${getButtonClass('lock')} ${vehicleState?.locked ? 'active' : ''}`}
                      onClick={() => executeCommand('lock', () => vehicleService.lockDoors(id))}
                      disabled={actionLoading['lock']}
                    >
                      <FiLock size={16} /> Lock
                    </button>
                    <button 
                      className={getButtonClass('unlock')}
                      onClick={() => executeCommand('unlock', () => vehicleService.unlockDoors(id))}
                      disabled={actionLoading['unlock']}
                    >
                      <FiUnlock size={16} /> Unlock
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Frunk</span>
                    <span className="control-value">{vehicleState?.ft ? 'Open' : 'Closed'}</span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={getButtonClass('frunk')}
                      onClick={() => executeCommand('frunk', () => vehicleService.actuateTrunk(id, 'front'))}
                      disabled={actionLoading['frunk']}
                    >
                      Open Frunk
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Trunk</span>
                    <span className="control-value">{vehicleState?.rt ? 'Open' : 'Closed'}</span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={getButtonClass('trunk')}
                      onClick={() => executeCommand('trunk', () => vehicleService.actuateTrunk(id, 'rear'))}
                      disabled={actionLoading['trunk']}
                    >
                      Toggle Trunk
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Sentry Mode</span>
                    <span className="control-value">{vehicleState?.sentry_mode ? 'Active' : 'Off'}</span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={`control-btn toggle ${vehicleState?.sentry_mode ? 'active' : ''}`}
                      onClick={() => executeCommand('sentry', () => vehicleService.setSentryMode(id, !vehicleState?.sentry_mode))}
                      disabled={actionLoading['sentry']}
                    >
                      {vehicleState?.sentry_mode ? 'Turn Off' : 'Turn On'}
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Valet Mode</span>
                    <span className="control-value">{vehicleState?.valet_mode ? 'Active' : 'Off'}</span>
                  </div>
                  <div className="control-actions">
                    <button 
                      className={`control-btn toggle ${vehicleState?.valet_mode ? 'active' : ''}`}
                      onClick={() => executeCommand('valet', () => vehicleService.setValetMode(id, !vehicleState?.valet_mode))}
                      disabled={actionLoading['valet']}
                    >
                      {vehicleState?.valet_mode ? 'Turn Off' : 'Turn On'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Controls Section */}
          <div className="control-section">
            <div className="section-header" onClick={() => toggleSection('controls')}>
              <div className="section-title">
                <BsGear size={20} />
                <span>Quick Controls</span>
              </div>
              <div className="section-status">
                {expandedSections.controls ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.controls && (
              <div className="section-content">
                <div className="quick-controls-grid">
                  <button 
                    className={getButtonClass('flashLights')}
                    onClick={() => executeCommand('flashLights', () => vehicleService.flashLights(id))}
                    disabled={actionLoading['flashLights']}
                  >
                    <FiSun size={20} />
                    <span>Flash Lights</span>
                  </button>

                  <button 
                    className={getButtonClass('honkHorn')}
                    onClick={() => executeCommand('honkHorn', () => vehicleService.honkHorn(id))}
                    disabled={actionLoading['honkHorn']}
                  >
                    <FiVolume2 size={20} />
                    <span>Honk Horn</span>
                  </button>

                  <button 
                    className={getButtonClass('ventWindows')}
                    onClick={() => executeCommand('ventWindows', () => vehicleService.ventWindows(id))}
                    disabled={actionLoading['ventWindows']}
                  >
                    <FiWind size={20} />
                    <span>Vent Windows</span>
                  </button>

                  <button 
                    className={getButtonClass('closeWindows')}
                    onClick={() => {
                      if (driveState?.latitude && driveState?.longitude) {
                        executeCommand('closeWindows', () => vehicleService.closeWindows(id, driveState.latitude, driveState.longitude));
                      }
                    }}
                    disabled={actionLoading['closeWindows'] || !driveState?.latitude}
                  >
                    <FiX size={20} />
                    <span>Close Windows</span>
                  </button>

                  <button 
                    className={getButtonClass('homelink')}
                    onClick={() => {
                      if (driveState?.latitude && driveState?.longitude) {
                        executeCommand('homelink', () => vehicleService.triggerHomelink(id, driveState.latitude, driveState.longitude));
                      }
                    }}
                    disabled={actionLoading['homelink'] || !driveState?.latitude}
                  >
                    <FiHome size={20} />
                    <span>HomeLink</span>
                  </button>

                  <button 
                    className={getButtonClass('remoteStart')}
                    onClick={() => executeCommand('remoteStart', () => vehicleService.remoteStartDrive(id))}
                    disabled={actionLoading['remoteStart']}
                  >
                    <IoCarSport size={20} />
                    <span>Remote Start</span>
                  </button>
                </div>

                <div className="control-row">
                  <div className="control-info">
                    <span className="control-label">Boombox</span>
                    <span className="control-value">Play sounds through external speaker</span>
                  </div>
                  <div className="control-actions multi">
                    <button 
                      className={getButtonClass('boomboxFart')}
                      onClick={() => executeCommand('boomboxFart', () => vehicleService.playBoombox(id, 0))}
                      disabled={actionLoading['boomboxFart']}
                    >
                      😂 Fart
                    </button>
                    <button 
                      className={getButtonClass('boomboxLocate')}
                      onClick={() => executeCommand('boomboxLocate', () => vehicleService.playBoombox(id, 2000))}
                      disabled={actionLoading['boomboxLocate']}
                    >
                      📍 Locate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Software Section */}
          <div className="control-section">
            <div className="section-header" onClick={() => toggleSection('software')}>
              <div className="section-title">
                <FiZap size={20} />
                <span>Software</span>
              </div>
              <div className="section-status">
                <span className="status-badge">
                  {vehicleState?.car_version?.split(' ')[0] || '--'}
                </span>
                {expandedSections.software ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </div>
            </div>
            
            {expandedSections.software && (
              <div className="section-content">
                <div className="software-info">
                  <div className="info-row">
                    <span className="info-label">Current Version</span>
                    <span className="info-value">{vehicleState?.car_version || '--'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Update Status</span>
                    <span className="info-value">
                      {vehicleState?.software_update?.status === 'available' 
                        ? '🟢 Update Available' 
                        : '✓ Up to date'}
                    </span>
                  </div>
                </div>

                {vehicleState?.software_update?.status === 'available' && (
                  <div className="control-row">
                    <div className="control-info">
                      <span className="control-label">Software Update</span>
                      <span className="control-value">
                        {vehicleState?.software_update?.download_perc || 0}% downloaded
                      </span>
                    </div>
                    <div className="control-actions">
                      <button 
                        className={getButtonClass('scheduleUpdate')}
                        onClick={() => executeCommand('scheduleUpdate', () => vehicleService.scheduleSoftwareUpdate(id, 0))}
                        disabled={actionLoading['scheduleUpdate']}
                      >
                        Install Now
                      </button>
                      <button 
                        className={getButtonClass('cancelUpdate')}
                        onClick={() => executeCommand('cancelUpdate', () => vehicleService.cancelSoftwareUpdate(id))}
                        disabled={actionLoading['cancelUpdate']}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;
