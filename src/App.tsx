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
import { ReportsProvider } from './services/ReportsContext';

// Create a separate component for the authenticated routes
const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check token expiration on app load
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated) {
        const token = getAuthToken();
        if (token) {
          // Token exists but is expired
          console.log('🔐 Token expired. Logging out...');
          authService.logout();
          navigate('/admin/login');
        }
      }
    };

    checkAuth();

    // Optional: Check token expiration periodically
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <ReportsProvider>
      <Routes> 
        {/* Root route - redirect based on auth status and role */}
        <Route 
          path="/" 
          element={
            <RootRedirect />
          } 
        />

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

        {/* Supervisor routes */}
        <Route path="/supervisor/login" element={<SupervisorLoginPage />} />
        <Route path="/supervisor/dashboard" element={<SupervisorDashboardPage />} />
        <Route path="/supervisor/reports" element={<SupervisorReportsPage />} />
        <Route path="/supervisor/actions" element={<SupervisorActionsPage />} />
        <Route path="/supervisor/analytics" element={<SupervisorAnalyticsPage />} />
        <Route path="/supervisor/profile" element={<SupervisorProfilePage />} />
        <Route path="/supervisor/certification" element={<SupervisorCertificationPage />} />
        <Route path="/supervisor/settings" element={<SupervisorSettingsPage />} />
          
      </Routes>
    </ReportsProvider>
  );
};

// Component to handle root redirect
const RootRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Always redirect to admin login first
    navigate('/admin/login', { replace: true });
  }, [navigate]);

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
          <Router>
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;