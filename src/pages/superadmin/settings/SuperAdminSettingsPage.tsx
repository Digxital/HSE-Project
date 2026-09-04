import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useToast } from '@/hooks/useToast';
import { getSuperAdminUserData, getAuthToken } from '@/utils/authStorage';
import { apiBaseUrl } from '@/lib/axios';
import {
  getSuperAdminNotificationPreferences,
  setSuperAdminNotificationPreferences,
} from '@/utils/superAdminNotificationPreferences';

interface SettingsData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  receiveOrgNotifications: boolean;
  receiveAdminUpdates: boolean;
}

const SuperAdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [settings, setSettings] = useState<SettingsData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    ...getSuperAdminNotificationPreferences(),
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const userData = getSuperAdminUserData();
  const displayName = userData?.name || 'Super Admin';
  const displayRole = userData?.role || 'Super Admin';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (field: keyof SettingsData, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (!settings.currentPassword) {
      showToast({ type: 'error', message: 'Please enter your current password' });
      return;
    }
    if (!settings.newPassword) {
      showToast({ type: 'error', message: 'Please enter your new password' });
      return;
    }
    if (settings.newPassword !== settings.confirmPassword) {
      showToast({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    if (settings.newPassword.length < 8) {
      showToast({ type: 'error', message: 'Password must be at least 8 characters' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const baseURL = apiBaseUrl;
      const token = getAuthToken();
      const response = await fetch(`${baseURL}/api/superadmin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      showToast({ type: 'success', message: 'Password changed successfully' });
      setSettings(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error: any) {
      showToast({ type: 'error', message: error.message || 'Failed to change password. Please try again.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotifications = () => {
    // Display preference only — persisted locally and applied by
    // useSuperAdminNotifications to filter what shows in the bell/list.
    // receiveAdminUpdates has no matching notification type yet, so it's
    // saved but inert until the backend introduces one.
    setSuperAdminNotificationPreferences({
      receiveOrgNotifications: settings.receiveOrgNotifications,
      receiveAdminUpdates: settings.receiveAdminUpdates,
    });

    showToast({
      type: 'success',
      message: 'Notification preferences saved',
    });
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // TODO: API call to logout
      console.log('Logging out...');
      
      showToast({
        type: 'success',
        message: 'Logged out successfully',
      });

      setTimeout(() => {
        navigate('/superadmin/login', { replace: true });
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      showToast({
        type: 'error',
        message: 'Error during logout',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors">
      {/* Backdrop for mobile sidebar */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <SuperAdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <TopBar
          pageTitle="Settings"
          userName={displayName}
          userRole={displayRole}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          showMenuButton={isMobile}
        />

        <main className="p-6 md:p-8 max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account preferences and security settings.
            </p>
          </div>

          {/* Change Password Section */}
          <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Change Password
            </h2>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={settings.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="mt-4 px-6 py-2 bg-[#C2410C] hover:bg-[#a83409] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>

          {/* Notification Section */}
          <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Notification
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Choose how you want to receive updates.
            </p>

            <div className="space-y-4">
              {/* Organization Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Receive organization notifications
                </span>
                <button
                  onClick={() =>
                    handleInputChange('receiveOrgNotifications', !settings.receiveOrgNotifications)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.receiveOrgNotifications
                      ? 'bg-[#C2410C]'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.receiveOrgNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Admin Updates */}
              <div className="flex items-center justify-between py-3 last:border-b-0">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Receive admin updates
                </span>
                <button
                  onClick={() =>
                    handleInputChange('receiveAdminUpdates', !settings.receiveAdminUpdates)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.receiveAdminUpdates
                      ? 'bg-[#C2410C]'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.receiveAdminUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveNotifications}
              className="mt-6 px-6 py-2 bg-[#C2410C] hover:bg-[#a83409] text-white font-semibold rounded-lg transition-colors"
            >
              Save Preferences
            </button>
          </div>

          {/* Logout Section */}
          <div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full px-6 py-3 border-2 border-[#C2410C] text-[#C2410C] dark:text-[#ff6b6b] font-semibold rounded-lg transition-colors ${
                isLoggingOut
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#C2410C] hover:text-white dark:hover:bg-[#ff6b6b] dark:hover:text-white'
              }`}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminSettingsPage;
