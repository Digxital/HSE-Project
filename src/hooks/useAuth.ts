// hooks/useAuth.ts
import { useEffect } from 'react';
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
      
      // Redirect to login
      navigate('/login');
    }
  };

  // Listen for auth:logout event from axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      navigate('/login');
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [navigate]);

  return { handleLogout };
};