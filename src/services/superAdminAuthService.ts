import { setAuthToken, setUserData } from '@/utils/authStorage';

interface LoginPayload {
  email: string;
  password: string;
}

interface SuperAdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: SuperAdminUser;
  };
}

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class SuperAdminAuthService {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await fetch(`${baseURL}/api/superadmin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      if (data.data.token) {
        setAuthToken(data.data.token, true); // Use localStorage for remember-me
      }

      if (data.data.user) {
        setUserData(
          {
            id: data.data.user.id,
            email: data.data.user.email,
            name: `${data.data.user.firstName} ${data.data.user.lastName}`,
            role: data.data.user.role,
          },
          true // Use localStorage for remember-me
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An error occurred during login');
    }
  }
}

export const superAdminAuthService = new SuperAdminAuthService();

// Global logout handler for when token becomes invalid
export const handleLogout = () => {
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  sessionStorage.removeItem('user_data');
  console.log('Session expired. Redirecting to login...');
  window.location.href = '/superadmin/login';
};
