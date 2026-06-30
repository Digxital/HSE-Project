import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useNotifications } from '@/contexts/NotificationContext';
import { getUserData } from '@/utils/authStorage';

interface Notification {
  id: string;
  type: 'ORGANIZATION' | 'USER' | 'SYSTEM';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  targetId?: string;
  organizationId?: string;
}

export const SuperAdminNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  useNotifications();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([
    {
      id: '1',
      type: 'ORGANIZATION' as const,
      title: 'New Organization Created',
      description: 'Acme Manufacturing Ltd has been successfully added to the platform.',
      timestamp: '2 minutes ago',
      isRead: false,
      targetId: '1',
      organizationId: 'acme-mfg',
    },
    {
      id: '2',
      type: 'ORGANIZATION' as const,
      title: 'Organization Activated',
      description: 'GreenField Logistics is now active and can access the platform.',
      timestamp: '15 minutes ago',
      isRead: false,
      targetId: '2',
      organizationId: 'greenfield-logs',
    },
    {
      id: '3',
      type: 'ORGANIZATION' as const,
      title: 'Organization Suspended',
      description: 'Access for Nova Energy Solutions has been suspended.',
      timestamp: 'Today at 9:42 AM',
      isRead: true,
      targetId: '3',
      organizationId: 'nova-energy',
    },
    {
      id: '4',
      type: 'USER' as const,
      title: 'Admin Account Created',
      description: 'An administrator account has been created for BrightCare Healthcare.',
      timestamp: 'Today at 9:42 AM',
      isRead: true,
      targetId: '4',
      organizationId: 'brightcare-health',
    },
  ]);

  const displayName = userData?.name || 'Admin';

  const mappedNotifications = localNotifications;

  const unreadCount = mappedNotifications.filter((notification) => !notification.isRead).length;

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORGANIZATION':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'USER':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        );
      case 'SYSTEM':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        );
    }
  };

  const getIconBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'ORGANIZATION':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'USER':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'SYSTEM':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
    }
  };

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'ORGANIZATION':
        return notification.organizationId
          ? `/superadmin/organization?id=${notification.organizationId}`
          : '/superadmin/organization/list';
      case 'SYSTEM':
        return '/superadmin/settings';
      default:
        return '/superadmin/dashboard';
    }
  };

  const handleOpenNotification = (notification: Notification) => {
    if (!notification.isRead) {
      setLocalNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
    const target = getNotificationLink(notification);
    if (target) {
      navigate(target);
    }
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const getActionLabel = (type: Notification['type']) => {
    switch (type) {
      case 'ORGANIZATION':
        return 'View Organization →';
      case 'USER':
        return 'View Details →';
      case 'SYSTEM':
        return 'Open Settings →';
      default:
        return 'View →';
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors">
      {/* Backdrop for mobile sidebar */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <SuperAdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Notifications"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={isMobile}
          userName={displayName}
          userRole="Super Admin"
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#FFFAF5] dark:bg-[#121212] rounded-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              {/* Page Header */}
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
                  <p className="text-gray-600 dark:text-gray-400">View and manage system updates and alerts</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleMarkAllAsRead()}
                  disabled={unreadCount === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                    unreadCount === 0
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                      : 'bg-white dark:bg-[#0D0D0D] text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  Mark All as Read
                </button>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {mappedNotifications.length > 0 ? (
                  mappedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleOpenNotification(notification)}
                      className={`p-4 rounded-lg border transition-colors bg-white dark:bg-[#0D0D0D] border-gray-100 dark:border-gray-700 cursor-pointer ${
                        !notification.isRead ? 'shadow-sm' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getIconBgColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {notification.timestamp}
                              </p>
                            </div>

                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              notification.isRead
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                : 'bg-[#C2410C] dark:bg-orange-600 text-white'
                            }`}>
                              {notification.isRead ? 'Read' : 'Unread'}
                            </span>
                          </div>

                          {/* Action Link */}
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenNotification(notification);
                            }}
                            className="text-sm font-medium text-[#C2410C] dark:text-orange-500 hover:text-[#A83409] dark:hover:text-orange-400 mt-3 inline-block transition-colors"
                          >
                            {getActionLabel(notification.type)}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
