import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FiUser, FiLogOut, FiInfo, FiGithub } from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="subtitle">Manage your dashboard preferences</p>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h2><FiUser size={20} /> Account</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Tesla Account</h3>
                <p>Connected via OAuth 2.0</p>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2><FiInfo size={20} /> About</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Tesla Dashboard</h3>
                <p>Version 1.0.0</p>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>API</h3>
                <p>Tesla Fleet API</p>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Source Code</h3>
                <p>Open source on GitHub</p>
              </div>
              <a 
                href="https://github.com/yerry262/Tesla-Dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="github-link"
              >
                <FiGithub size={16} />
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Data Privacy</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Your Data</h3>
                <p>All vehicle data is fetched directly from Tesla's API. No data is stored on our servers.</p>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Session</h3>
                <p>Your session tokens are stored locally and expire after 8 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
