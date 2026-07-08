// hooks/useAuth.ts
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { removeAuthToken, removeUserData } from '@/utils/authStorage';

export const useAuth = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage
      removeAuthToken();
      removeUserData();

      // Redirect to role selection page
      navigate('/');
    }
  };

  // Note: the global `auth:logout` event (dispatched by the axios 401
  // interceptor) is handled centrally in AppRoutes via useOrgStatusMonitor,
  // which redirects to /admin/login or /supervisor/login. Do not also
  // listen for it here — a second listener races the navigation and can
  // send the user to the wrong page.

  return { handleLogout };
};