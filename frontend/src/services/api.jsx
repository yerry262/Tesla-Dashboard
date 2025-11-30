import axios from 'axios';

// Determine API URL based on environment
// In production (GitHub Pages), use the Railway backend
// In development, use the Vite proxy (empty string means relative URLs)
const isProduction = import.meta.env.PROD;
const API_URL = isProduction 
  ? 'https://tesla-dashboard-production-7fcd.up.railway.app'
  : (import.meta.env.VITE_API_URL || '');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't tried refreshing yet
    if (error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', { refreshToken });
        
        // Update tokens if returned
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          // Update the failed request's header with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
