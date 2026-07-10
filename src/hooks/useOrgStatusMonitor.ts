import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '@/utils/authStorage';
import { isPublicRoute } from '@/utils/routeGuards';
import { useToast } from './useToast';
import api from '@/lib/axios';

// SuperAdmin has its own session management (superAdminAuthService → handleLogout)
// and must never be touched here. Role strings for superadmin vary across the app
// ('superadmin', 'super_admin', 'super-admin'), so path is the reliable signal —
// same check used in axios.ts, App.tsx, ReportsContext.tsx, and TopBar.tsx.
const isSuperAdminSession = () => {
  if (window.location.pathname.startsWith('/superadmin')) return true;
  const role = getUserData()?.role?.toLowerCase() ?? '';
  return role.includes('superadmin') || role.includes('super_admin') || role.includes('super-admin');
};

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
    const checkOrgStatus = async () => {
      // Skip if tab is hidden, on a public route, not logged in, or this is a superadmin session
      if (document.hidden) return;
      if (isPublicRoute()) return;
      if (isSuperAdminSession()) return;
      if (!getUserData()) return;

      try {
        const response = await api.get('/api/admin/organization/status', {
          headers: {
            'X-PLATFORM': 'web',
          },
        });

        const currentStatus = response.data?.data?.status;
        const isFirstCheck = lastStatusRef.current === null;

        // Detect SUSPENDED/INACTIVE on the first check too (e.g. the org was
        // suspended while the session's token was still valid, so the user
        // never hit a fresh login screen that would have blocked them).
        if (
          (isFirstCheck || lastStatusRef.current !== currentStatus) &&
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

    // Listen for global auth:logout events (from axios interceptor on 401).
    // This also fires when the backend rejects a request outright because the
    // organization is suspended/inactive, not just on a genuinely expired token —
    // so always warn before redirecting rather than navigating silently.
    const handleAuthLogout = () => {
      // Landing page / login screens have no session to protect — don't warn
      // or redirect a visitor who was never really "logged in" on this page.
      if (isPublicRoute()) return;

      // SuperAdmin dispatches its own auth:logout as part of superAdminAuthService's
      // handleLogout flow — let that own its redirect, don't race it or clear its tokens.
      if (isSuperAdminSession()) return;

      showToast({
        type: 'error',
        message: 'Your account has been deactivated. Please contact your administrator.',
      });

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
