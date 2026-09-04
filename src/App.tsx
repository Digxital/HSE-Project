import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ActionsPage } from '@/pages/ActionsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { CertificationPage } from '@/pages/CertificationPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { AuditLogPage } from '@/pages/AuditLogPage';
import { LandingPage } from '@/pages/landing/LandingPage';
import { SuperAdminLoginPage } from '@/pages/superadmin/SuperAdminLoginPage';
import { SuperAdminDashboardPage } from '@/pages/superadmin/SuperAdminDashboardPage';
import SuperAdminOrganizationPageWithBoundary from '@/pages/superadmin/organization/OrganizationListPage';
import { default as SuperAdminProfilePage } from '@/pages/superadmin/profile/SuperAdminProfilePage';
import { default as SuperAdminSettingsPage } from '@/pages/superadmin/settings/SuperAdminSettingsPage';
import { SuperAdminNotificationsPage } from '@/pages/superadmin/SuperAdminNotificationsPage';
import { SuperAdminDemoRequestsPage } from '@/pages/superadmin/SuperAdminDemoRequestsPage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { authService } from '@/services/authService';
import { getAuthToken, getUserData } from '@/utils/authStorage';
import { NotificationProvider } from '@/contexts/NotificationContext';
 
import AOS from 'aos';
import { SupervisorLoginPage } from '@/pages/SupervisorLoginPage';
import { SupervisorActionsPage } from '@/pages/supervisor/SupervisorActionsPage';
import { SupervisorAnalyticsPage } from '@/pages/supervisor/SupervisorAnalyticsPage';
import { SupervisorDashboardPage } from '@/pages/supervisor/SupervisorDashboardPage';
import { SupervisorProfilePage } from '@/pages/supervisor/SupervisorProfilePage';
import { SupervisorReportsPage } from '@/pages/supervisor/SupervisorReportsPage';
import { SupervisorSettingsPage } from '@/pages/supervisor/SupervisorSettingsPage';
import { ReportsProvider } from '@/services/ReportsContext';
import { OrganizationsProvider } from '@/services/OrganizationContext';
import { useOrgStatusMonitor } from '@/hooks/useOrgStatusMonitor';
import { OrgSuspendedModal } from '@/components/common/OrgSuspendedModal';
import { isPublicRoute } from '@/utils/routeGuards';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SuperAdminProtectedRoute } from '@/components/auth/SuperAdminProtectedRoute';

// Create a separate component for the authenticated routes
const AppRoutes = () => {
  const navigate = useNavigate();
  const { showSuspendedModal, handleDismiss } = useOrgStatusMonitor();

  useEffect(() => {
    // Check token expiration on app load (admin/supervisor only)
    const checkAuth = () => {
      const currentPath = window.location.pathname;

      // Landing page / login screens have no session to monitor — a stale
      // token left over from a previous login must not force a redirect here.
      if (isPublicRoute(currentPath)) return;

      // SuperAdmin has its own session handling — never interfere
      if (currentPath.startsWith('/superadmin')) return;

      // Also skip if a superadmin token is stored, regardless of current path
      const storedRole = getUserData()?.role?.toLowerCase() ?? '';
      if (storedRole.includes('superadmin') || storedRole.includes('super_admin') || storedRole.includes('super-admin')) return;

      const isAuthenticated = authService.isAuthenticated();

      if (!isAuthenticated) {
        const token = getAuthToken();
        if (token) {
          console.log('🔐 Token expired. Logging out...');
          authService.logout();
          const loginPath = currentPath.startsWith('/supervisor')
            ? '/supervisor/login'
            : '/admin/login';
          navigate(loginPath);
        }
      }
    };

    checkAuth();

    // Check token expiration periodically (every 5 minutes — gives enough buffer)
    const interval = setInterval(checkAuth, 300000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
    <Routes>
      {/* Root route - redirect based on auth status and role */}
      <Route 
        path="/" 
        element={
          <RootRedirect />
        } 
      />

      {/* Super Admin Routes */}
      <Route path="/superadmin" element={<Navigate to="/superadmin/login" replace />} />
      <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
      <Route path="/superadmin/dashboard" element={<SuperAdminProtectedRoute><SuperAdminDashboardPage /></SuperAdminProtectedRoute>} />
      <Route path="/superadmin/profile" element={<SuperAdminProtectedRoute><SuperAdminProfilePage /></SuperAdminProtectedRoute>} />
      <Route path="/superadmin/settings" element={<SuperAdminProtectedRoute><SuperAdminSettingsPage /></SuperAdminProtectedRoute>} />
      <Route path="/superadmin/notifications" element={<SuperAdminProtectedRoute><SuperAdminNotificationsPage /></SuperAdminProtectedRoute>} />
      <Route path="/superadmin/demo-requests" element={<SuperAdminProtectedRoute><SuperAdminDemoRequestsPage /></SuperAdminProtectedRoute>} />
      <Route path="/superadmin/organization" element={<SuperAdminProtectedRoute><SuperAdminOrganizationPageWithBoundary /></SuperAdminProtectedRoute>} />
      <Route path="/superadmin/organization/list" element={<SuperAdminProtectedRoute><SuperAdminOrganizationPageWithBoundary /></SuperAdminProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><DashboardPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagementPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><ReportsPage /></ProtectedRoute>} />
      <Route path="/actions" element={<ProtectedRoute allowedRoles={['ADMIN']}><ActionsPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['ADMIN']}><ProfilePage /></ProtectedRoute>} />
      <Route path="/certification" element={<ProtectedRoute allowedRoles={['ADMIN']}><CertificationPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><SettingsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><NotificationsPage /></ProtectedRoute>} />
      <Route path="/audit-log" element={<ProtectedRoute allowedRoles={['ADMIN']}><AuditLogPage /></ProtectedRoute>} />

      {/* Supervisor routes */}
      <Route path="/supervisor/login" element={<SupervisorLoginPage />} />
      <Route path="/supervisor/dashboard" element={<ProtectedRoute allowedRoles={['SUPERVISOR']}><SupervisorDashboardPage /></ProtectedRoute>} />
      <Route path="/supervisor/reports" element={<ProtectedRoute allowedRoles={['SUPERVISOR']}><SupervisorReportsPage /></ProtectedRoute>} />
      <Route path="/supervisor/actions" element={<ProtectedRoute allowedRoles={['SUPERVISOR']}><SupervisorActionsPage /></ProtectedRoute>} />
      <Route path="/supervisor/analytics" element={<ProtectedRoute allowedRoles={['SUPERVISOR']}><SupervisorAnalyticsPage /></ProtectedRoute>} />
      <Route path="/supervisor/profile" element={<ProtectedRoute allowedRoles={['SUPERVISOR']}><SupervisorProfilePage /></ProtectedRoute>} />
      <Route path="/supervisor/settings" element={<ProtectedRoute allowedRoles={['SUPERVISOR']}><SupervisorSettingsPage /></ProtectedRoute>} />
      <Route path="/supervisor/notifications" element={<ProtectedRoute allowedRoles={['SUPERVISOR']}><NotificationsPage role="supervisor" /></ProtectedRoute>} />

      {/* Fallback for any unmatched path — without this, an unrecognized URL leaves
          the app blank after the loading screen since no Route matches it. */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
      <OrgSuspendedModal isOpen={showSuspendedModal} onDismiss={handleDismiss} />
    </>
  );
};

// Root route always shows the landing page — dashboards are only reached
// via an explicit login (the login pages navigate straight there on success)
// or a direct/bookmarked URL, never via an auto-redirect from "/".
const RootRedirect = () => {
  return <LandingPage />;
};

// The branded splash (logo + 2.5s delay) makes sense for the authenticated
// app shell, but it's the wrong first impression for a public marketing page —
// visitors should see the landing page immediately, not a loading screen.
const isLandingPage = window.location.pathname === '/';

function App() {
  const [isLoading, setIsLoading] = useState(!isLandingPage);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });

    if (isLandingPage) return;

    // Hide loading screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationProvider>
          <ReportsProvider>
            <OrganizationsProvider>
              <Router>
                <AppRoutes />
              </Router>
            </OrganizationsProvider>
          </ReportsProvider>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;