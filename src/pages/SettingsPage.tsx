import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

interface SettingsPageProps {
  role?: 'admin' | 'supervisor';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ role = 'admin' }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [notifications, setNotifications] = useState({
    reportNotifications: false,
    actionUpdates: false,
    overdueAlerts: false,
    weeklySummary: false,
  });

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileSidebarToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileSidebar = () => {
    setMobileMenuOpen(false);
  };

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    // Navigate to role selection page
    navigate('/');
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ 
    enabled, 
    onToggle 
  }: { 
    enabled: boolean; 
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        enabled ? 'bg-primary-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-background-light">
      {/* Backdrop for mobile sidebar */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={closeMobileSidebar}
        role={role}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Settings"
          onMenuClick={handleMobileSidebarToggle}
          showMenuButton={isMobile}
          userName={role === 'supervisor' ? 'John Matthew' : 'Peter Omorogbolahan'}
          userRole={role === 'supervisor' ? 'Supervisor' : 'Admin'}
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl">
            {/* Settings Header */}
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Settings</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your account preferences and security settings.</p>
            </div>

            {/* Change Password Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Change Password</h3>
              
              {/* Current Password */}
              <div className="mb-4 md:w-[calc(50%-0.5rem)]">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder=""
                />
              </div>

              {/* New Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* Notification Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Notification</h3>
              <p className="text-sm text-gray-600 mb-6">Choose how you want to receive updates.</p>

              <div className="space-y-3">
                {/* Receive report notifications */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-white rounded-lg">
                  <span className="text-sm text-gray-700">Receive report notifications</span>
                  <ToggleSwitch 
                    enabled={notifications.reportNotifications} 
                    onToggle={() => handleToggle('reportNotifications')} 
                  />
                </div>

                {/* Receive action updates */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-white rounded-lg">
                  <span className="text-sm text-gray-700">Receive action updates</span>
                  <ToggleSwitch 
                    enabled={notifications.actionUpdates} 
                    onToggle={() => handleToggle('actionUpdates')} 
                  />
                </div>

                {/* Receive overdue alerts */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-white rounded-lg">
                  <span className="text-sm text-gray-700">Receive overdue alerts</span>
                  <ToggleSwitch 
                    enabled={notifications.overdueAlerts} 
                    onToggle={() => handleToggle('overdueAlerts')} 
                  />
                </div>

                {/* Receive weekly summary */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-white rounded-lg">
                  <span className="text-sm text-gray-700">Receive weekly summary</span>
                  <ToggleSwitch 
                    enabled={notifications.weeklySummary} 
                    onToggle={() => handleToggle('weeklySummary')} 
                  />
                </div>
              </div>
            </div>

            {/* Log out Button */}
            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 border-2 border-red-400 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Log out
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
