import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ActionsPage } from '@/pages/ActionsPage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ToastProvider } from '@/contexts/ToastContext';
import { authService } from '@/services/authService';
import { getAuthToken } from '@/utils/authStorage';

import AOS from 'aos';

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
          navigate('/login');
        }
      }
    };

    checkAuth();

    // Optional: Check token expiration periodically
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UserManagementPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/actions" element={<ActionsPage />} />
    </Routes>
  );
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
    <ToastProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ToastProvider>
  );
}

export default App;