import api from '@/lib/axios';
import { setAuthToken, setUserData, getAuthToken, removeAuthToken, removeUserData } from '@/utils/authStorage';
import type { LoginResponse } from '@/types/auth';

interface LoginCredentials {
  email: string;
  password: string;
}
 
export const authService = {

  async adminLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', credentials);

    // Store tokens immediately after login
    if (response.data.data.token) {
      setAuthToken(response.data.data.token, true); // true for localStorage
    }
    if (response.data.data.user) {
      setUserData(response.data.data.user, true);
    }

    return response.data; 
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', credentials);
    // Store tokens immediately after login
    if (response.data.data.token) {
      setAuthToken(response.data.data.token, true);
    }
    if (response.data.data.user) {
      setUserData(response.data.data.user, true);
    }
    return response.data;
  },

 
  async logout() {
    // Never clear a superadmin session from this method — superadmin has its own logout flow
    if (window.location.pathname.startsWith('/superadmin')) return;

    try {
      const token = getAuthToken();
      if (token) {
        await api.post('/api/auth/logout', {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Remove only auth-specific keys — never nuke all of localStorage
      removeAuthToken();
      removeUserData();
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('refresh_token');
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
      // JWTs use base64url (- and _ instead of + and /) — atob needs standard base64
      const base64url = token.split('.')[1];
      const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      // If we can't decode the token treat it as expired
      return false;
    }
  }

  
};