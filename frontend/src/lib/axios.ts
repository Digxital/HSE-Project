import axios from 'axios';
import { getAuthToken } from '@/utils/authStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'X-PLATFORM': 'web'
  },
}); 

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token refresh or logout on 401
    if (error.response?.status === 401) {
      // Implement token refresh logic or redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;