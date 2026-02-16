import api from '@/lib/axios';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  async logout() {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  }
};