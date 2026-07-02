import {
  setAuthToken,
  setSuperAdminAuthToken,
  setSuperAdminUserData,
  setUserData,
  removeAuthToken,
  removeSuperAdminAuthToken,
  removeSuperAdminUserData,
  removeUserData,
} from '@/utils/authStorage';

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
        // Keep role-isolated token for superadmin flows.
        setSuperAdminAuthToken(data.data.token, true);
        // Keep generic token for backward compatibility with shared modules.
        setAuthToken(data.data.token, true);
      }

      if (data.data.user) {
        const userData = {
          id: data.data.user.id,
          email: data.data.user.email,
          name: `${data.data.user.firstName} ${data.data.user.lastName}`,
          role: data.data.user.role,
        };
        setSuperAdminUserData(userData, true);
        // Keep generic user data for backward compatibility with shared modules.
        setUserData(userData, true);
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

// Global logout handler for when SuperAdmin token becomes invalid (called by organizationService on 401)
export const handleLogout = () => {
  // Only act if actually in a superadmin session — prevents the polling interval from
  // redirecting non-superadmin users to /superadmin/login when it fires without a token.
  if (!window.location.pathname.startsWith('/superadmin')) {
    return;
  }
  removeSuperAdminAuthToken();
  removeSuperAdminUserData();
  // Clear generic keys as well for existing shared consumers.
  removeAuthToken();
  removeUserData();
  window.dispatchEvent(new CustomEvent('auth:logout'));
  console.log('SuperAdmin session expired. Redirecting to login...');
  window.location.href = '/superadmin/login';
};
