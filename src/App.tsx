import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import { SupervisorCertificationPage } from '@/pages/supervisor/SupervisorCertificationPage';
import { SupervisorDashboardPage } from '@/pages/supervisor/SupervisorDashboardPage';
import { SupervisorProfilePage } from '@/pages/supervisor/SupervisorProfilePage';
import { SupervisorReportsPage } from '@/pages/supervisor/SupervisorReportsPage';
import { SupervisorSettingsPage } from '@/pages/supervisor/SupervisorSettingsPage';
import { ReportsProvider } from '@/services/ReportsContext';
import { OrganizationsProvider } from '@/services/OrganizationContext';

// Create a separate component for the authenticated routes
const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check token expiration on app load (admin/supervisor only)
    const checkAuth = () => {
      const currentPath = window.location.pathname;

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
    <Routes> 
      {/* Root route - redirect based on auth status and role */}
      <Route 
        path="/" 
        element={
          <RootRedirect />
        } 
      />

      {/* Super Admin Routes */}
      <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboardPage />} />
      <Route path="/superadmin/profile" element={<SuperAdminProfilePage />} />
      <Route path="/superadmin/settings" element={<SuperAdminSettingsPage />} />
      <Route path="/superadmin/organization" element={<SuperAdminOrganizationPageWithBoundary />} />
      <Route path="/superadmin/organization/list" element={<SuperAdminOrganizationPageWithBoundary />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UserManagementPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/actions" element={<ActionsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/certification" element={<CertificationPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/audit-log" element={<AuditLogPage />} />

      {/* Supervisor routes */}
      <Route path="/supervisor/login" element={<SupervisorLoginPage />} />
      <Route path="/supervisor/dashboard" element={<SupervisorDashboardPage />} />
      <Route path="/supervisor/reports" element={<SupervisorReportsPage />} />
      <Route path="/supervisor/actions" element={<SupervisorActionsPage />} />
      <Route path="/supervisor/analytics" element={<SupervisorAnalyticsPage />} />
      <Route path="/supervisor/profile" element={<SupervisorProfilePage />} />
      <Route path="/supervisor/certification" element={<SupervisorCertificationPage />} />
      <Route path="/supervisor/settings" element={<SupervisorSettingsPage />} />
      <Route path="/supervisor/notifications" element={<NotificationsPage role="supervisor" />} />
        
    </Routes>
  );
};

// Component to handle root redirect or show landing page
const RootRedirect = () => {
  const navigate = useNavigate();
  const [showLanding, setShowLanding] = useState(false);
  
  useEffect(() => {
    // Check if user data exists to determine role
    const userDataStr = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    const token = getAuthToken();
    
    // If user is authenticated, redirect to dashboard
    if (token && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const role = (userData.role ?? '').toLowerCase();
        if (role.includes('superadmin') || role.includes('super_admin') || role.includes('super-admin')) {
          navigate('/superadmin/dashboard', { replace: true });
          return;
        }
        if (role === 'supervisor') {
          navigate('/supervisor/dashboard', { replace: true });
          return;
        }
      } catch (e) {
        // JSON parse error, continue
      }

      // Default to admin dashboard
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // If not authenticated, show landing page
    setShowLanding(true);
  }, [navigate]);

  // Show landing page for unauthenticated users
  if (showLanding) {
    return <LandingPage />;
  }

  // Loading state while checking authentication
  return <LoadingScreen />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });

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