import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ActionsPage } from '@/pages/ActionsPage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ToastProvider } from '@/contexts/ToastContext';
// import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
// import { CheckYourMailPage } from '@/pages/CheckYourMailPage';
import AOS from 'aos';

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
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/actions" element={<ActionsPage />} />
          {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
          {/* <Route path="/check-your-mail" element={<CheckYourMailPage />} /> */}
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;