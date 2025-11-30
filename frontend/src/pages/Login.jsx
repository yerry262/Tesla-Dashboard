import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FiZap } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <FiZap size={48} />
          </div>
          <h1>Tesla Dashboard</h1>
          <p>Monitor your Tesla Model Y in real-time</p>
        </div>

        <div className="login-content">
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🔋</span>
              <div>
                <h3>Battery Status</h3>
                <p>Real-time charge level and range</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">📍</span>
              <div>
                <h3>Vehicle Location</h3>
                <p>Track your car's location</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <div>
                <h3>Charging Info</h3>
                <p>Nearby Superchargers and status</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🌡️</span>
              <div>
                <h3>Climate Data</h3>
                <p>Interior and exterior temperature</p>
              </div>
            </div>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            <svg viewBox="0 0 342 35" className="tesla-logo">
              <path d="M0 .1a9.7 9.7 0 007 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 007-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 006-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 00-8.7 7h39.9v-21h-31.2v-7h24zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 007.1-7H78.3a9.6 9.6 0 007 7zm0 13.8h26a9.6 9.6 0 007.1-7H78.3a9.6 9.6 0 007 7zm0 14.1h26a9.6 9.6 0 007.1-7H78.3a9.6 9.6 0 007 7zM308.5 7h26a9.6 9.6 0 007-7h-40a9.6 9.6 0 007 7z" fill="currentColor"/>
            </svg>
            Sign in with Tesla
          </button>

          <p className="login-disclaimer">
            This application uses Tesla's official Fleet API to access your vehicle data.
            Your credentials are securely handled by Tesla.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
