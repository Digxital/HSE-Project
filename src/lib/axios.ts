import axios from 'axios';
import { getAuthToken, removeAuthToken, removeUserData } from '@/utils/authStorage';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://hse-backend-n8d4.onrender.com';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-PLATFORM': 'web'
  }, 
  timeout: 30000,
}); 

let hasLoggedApiInfo = false;
if (!hasLoggedApiInfo) {
  console.info('API base URL:', apiBaseUrl);
  hasLoggedApiInfo = true;
}
 
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
    const status = error.response?.status;
    const requestUrl = `${error.config?.baseURL || apiBaseUrl}${error.config?.url || ''}`;

    if (error.code === 'ECONNABORTED' || String(error.message || '').includes('timeout')) {
      console.warn('API request timed out:', { url: requestUrl, timeoutMs: api.defaults.timeout });
    } else if (!status) {
      console.warn('API request failed before response:', { url: requestUrl, message: error.message });
    }

    // Handle token refresh or logout on 401
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔐 Token expired or invalid. Logging out...');
      // Clear all auth data
      removeAuthToken();
      removeUserData();
      // Dispatch custom event for logout — useAuth hook listens for this and navigates to /login
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export { apiBaseUrl };
export default api;