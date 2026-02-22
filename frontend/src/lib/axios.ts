import axios from 'axios';
import { getAuthToken, removeAuthToken, removeUserData  } from '@/utils/authStorage';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'X-PLATFORM': 'web'
  }, 
  timeout: 10000,
}); 
 
  // Request interceptor to add auth token
  api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }); 

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Handle token refresh or logout on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔐 Token expired or invalid. Logging out...');
      // Clear all auth data
      removeAuthToken();
      removeUserData();
      // Dispatch custom event for logout
      window.dispatchEvent(new CustomEvent('auth:logout'));
      // Redirect to login page
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;