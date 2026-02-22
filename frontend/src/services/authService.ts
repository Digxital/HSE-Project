import api from '@/lib/axios';
import { setAuthToken, setRefreshToken, setUserData, getAuthToken } from '@/utils/authStorage';

interface LoginCredentials {
  email: string;
  password: string;
}
 
interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
 
export const authService = {

  async adminLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/api/admin/auth/login', credentials);

    // Store tokens immediately after login
    if (response.data.token) {
      setAuthToken(response.data.token, true); // true for localStorage
    }
    if (response.data.refreshToken) {
      setRefreshToken(response.data.refreshToken, true);
    }
    if (response.data.user) {
      setUserData(response.data.user, true);
    }

    return response.data; 
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', credentials);
    // Store tokens immediately after login
    if (response.data.token) {
      setAuthToken(response.data.token, true);
    }
    if (response.data.refreshToken) {
      setRefreshToken(response.data.refreshToken, true);
    }
    if (response.data.user) {
      setUserData(response.data.user, true);
    }
    return response.data;
  },

 
  async logout() {
    try {
      const token = getAuthToken();
      if (token) {
        await api.post('/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear all auth data
      localStorage.clear();
      sessionStorage.clear();
      
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/api/auth/refresh', {
        refreshToken
      });

      if (response.data.token) {
        setAuthToken(response.data.token, true);
      }
      
      return response.data;
    } catch (error) {
      console.error('Refresh token failed:', error);
      // If refresh fails, logout
      await this.logout();
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; 
      return Date.now() < exp;
    } catch {
      return false;
    }
  } 

  
};