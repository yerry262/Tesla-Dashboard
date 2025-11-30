import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.jsx';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/status');
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      console.error('Auth status check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      const response = await api.get('/auth/login');
      // Redirect to Tesla's authorization page
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleCallback = async (code, state) => {
    try {
      const response = await api.post('/auth/token', { code, state });
      
      // Store tokens in localStorage for mobile support (where cookies might be blocked)
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async () => {
    try {
      // Try to get refresh token from storage if not in cookie
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const response = await api.post('/auth/refresh', { refreshToken: storedRefreshToken });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      return false;
    }
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    handleCallback,
    refreshToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
