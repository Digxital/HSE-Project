import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleSelectionPage } from '@/pages/RoleSelectionPage';
import { LoginPage } from '@/pages/LoginPage';
import { SupervisorLoginPage } from '@/pages/SupervisorLoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ActionsPage } from '@/pages/ActionsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { CertificationPage } from '@/pages/CertificationPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SupervisorDashboardPage } from '@/pages/supervisor/SupervisorDashboardPage';
import { SupervisorReportsPage } from '@/pages/supervisor/SupervisorReportsPage';
import { SupervisorActionsPage } from '@/pages/supervisor/SupervisorActionsPage';
import { SupervisorAnalyticsPage } from '@/pages/supervisor/SupervisorAnalyticsPage';
import { SupervisorProfilePage } from '@/pages/supervisor/SupervisorProfilePage';
import { SupervisorCertificationPage } from '@/pages/supervisor/SupervisorCertificationPage';
import { SupervisorSettingsPage } from '@/pages/supervisor/SupervisorSettingsPage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ReportsProvider } from '@/services/ReportsContext';
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
    <ReportsProvider>
      <Router>
      <Routes>
        {/* Role Selection (entry point) */}
        <Route path="/" element={<RoleSelectionPage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<LoginPage />} />
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

        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/check-your-mail" element={<CheckYourMailPage />} /> */}
      </Routes>
      </Router>
    </ReportsProvider>
  );
}

export default App;