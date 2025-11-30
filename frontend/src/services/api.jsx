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

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't tried refreshing yet
    if (error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
