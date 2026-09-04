import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { getUserData } from '@/utils/authStorage';

type Role = 'ADMIN' | 'SUPERVISOR';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

// Guards the shared admin/supervisor auth_token routes. An unauthenticated
// visitor is sent to the matching login page with a `redirect` param so they
// land back here after signing in. An authenticated user in the wrong role's
// area (e.g. a supervisor hitting an admin-only URL) is sent to their own
// dashboard instead of being logged out — they're not an intruder, just at
// the wrong URL.
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const loginPath = allowedRoles.includes('SUPERVISOR') && !allowedRoles.includes('ADMIN')
    ? '/supervisor/login'
    : '/admin/login';

  if (!authService.isAuthenticated()) {
    const target = `${location.pathname}${location.search}`;
    return <Navigate to={`${loginPath}?redirect=${encodeURIComponent(target)}`} replace />;
  }

  const role = getUserData()?.role;
  const isKnownRole = role === 'ADMIN' || role === 'SUPERVISOR';

  // No usable role on record despite a valid token (shouldn't happen — login always
  // sets both together — but treat it as unauthenticated rather than guessing a
  // destination, since a wrong guess here could redirect a route back to itself.
  if (!isKnownRole) {
    const target = `${location.pathname}${location.search}`;
    return <Navigate to={`${loginPath}?redirect=${encodeURIComponent(target)}`} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === 'SUPERVISOR' ? '/supervisor/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};
