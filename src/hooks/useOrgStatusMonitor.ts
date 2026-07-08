import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '@/utils/authStorage';
import { useToast } from './useToast';
import api from '@/lib/axios';

/**
 * Monitors the current user's organization status and logs out if suspended/deactivated.
 * Only runs for admin/supervisor users (not superadmin).
 */
export const useOrgStatusMonitor = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);
  const lastStatusRef = useRef<string | null>(null);
  const logoutTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const userData = getUserData();
    const userRole = userData?.role?.toUpperCase();

    // Only run for admin/supervisor users (not superadmin)
    if (!userData || userRole === 'SUPERADMIN' || userRole === 'SUPER_ADMIN') {
      return;
    }

    const checkOrgStatus = async () => {
      // Skip if tab is hidden
      if (document.hidden) return;

      try {
        const response = await api.get('/api/admin/organization/status', {
          headers: {
            'X-PLATFORM': 'web',
          },
        });

        const currentStatus = response.data?.data?.status;

        // Initialize on first check
        if (lastStatusRef.current === null) {
          lastStatusRef.current = currentStatus;
          return;
        }

        // Detect status change to SUSPENDED or INACTIVE
        if (
          lastStatusRef.current !== currentStatus &&
          (currentStatus === 'SUSPENDED' || currentStatus === 'INACTIVE')
        ) {
          console.warn('Organization status changed to:', currentStatus);
          setShowSuspendedModal(true);

          // Auto-logout after 5 seconds
          logoutTimerRef.current = setTimeout(() => {
            handleLogout();
          }, 5000);
        }

        lastStatusRef.current = currentStatus;
      } catch (error) {
        // Silent fail - axios interceptor handles 401s globally
        // Other errors (403, 500, network) shouldn't disrupt user experience
        console.error('Org status check failed:', error);
      }
    };

    const handleLogout = () => {
      showToast({
        type: 'error',
        message: 'Your organization has been suspended. Logging out...',
      });

      // Clear tokens and redirect
      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        if (window.location.pathname.includes('/supervisor')) {
          navigate('/supervisor/login', { replace: true });
        } else {
          navigate('/admin/login', { replace: true });
        }
      }, 500);
    };

    // Listen for global auth:logout events (from axios interceptor on 401)
    const handleAuthLogout = () => {
      // Token expired/invalid - logout immediately without modal
      localStorage.clear();
      sessionStorage.clear();

      if (window.location.pathname.includes('/supervisor')) {
        navigate('/supervisor/login', { replace: true });
      } else {
        navigate('/admin/login', { replace: true });
      }
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    // Initial check
    checkOrgStatus();

    // Poll every 30 seconds
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        checkOrgStatus();
      }
    }, 30000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('auth:logout', handleAuthLogout);
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [navigate, showToast]);

  const handleDismiss = () => {
    setShowSuspendedModal(false);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  };

  return { showSuspendedModal, handleDismiss };
};
