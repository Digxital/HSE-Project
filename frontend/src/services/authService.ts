import api from '@/lib/axios';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async adminLogin(credentials: LoginCredentials) {
    const response = await api.post('/api/admin/auth/login', credentials);
    return response.data; 
  },

  async login(credentials: LoginCredentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

 
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/api/admin/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Still clear local storage even if API fails
    }
  },

  async refreshToken() {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  }
};