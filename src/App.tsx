import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/dashboard" element={<DashboardPage />} />
         <Route path="/users" element={<UserManagementPage />} />
         <Route path="/reports" element={<ReportsPage />} />
         <Route path="/actions" element={<ActionsPage />} />
         <Route path="/analytics" element={<AnalyticsPage />} />
         <Route path="/profile" element={<ProfilePage />} />
         <Route path="/certification" element={<CertificationPage />} />
         <Route path="/settings" element={<SettingsPage />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/check-your-mail" element={<CheckYourMailPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;