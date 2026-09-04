import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isSuperAdminTokenValid } from '@/services/superAdminAuthService';

// Guards /superadmin/* routes. Superadmin has its own token (superadmin_auth_token),
// separate from the shared admin/supervisor auth_token — see ProtectedRoute for that side.
export const SuperAdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  if (!isSuperAdminTokenValid()) {
    const target = `${location.pathname}${location.search}`;
    return <Navigate to={`/superadmin/login?redirect=${encodeURIComponent(target)}`} replace />;
  }

  return <>{children}</>;
};
