import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
// import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
// import { CheckYourMailPage } from '@/pages/CheckYourMailPage';
import AOS from 'aos';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/dashboard" element={<DashboardPage />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/check-your-mail" element={<CheckYourMailPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;