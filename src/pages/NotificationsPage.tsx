import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

interface Notification {
  id: string;
  type: 'REPORT' | 'ACTION' | 'SYSTEM';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
  actionLinkText?: string;
}

interface NotificationsPageProps {
  role?: 'admin' | 'supervisor';
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ role = 'admin' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mock notifications data
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'REPORT',
      title: 'New Hazard Report Submitted',
      description: 'A new hazard report was submitted at the production site',
      timestamp: '6 minutes ago',
      isRead: false,
      actionLink: '/reports',
      actionLinkText: 'View Report →',
    },
    {
      id: '2',
      type: 'REPORT',
      title: 'A new report has been submitted and is awaiting review',
      description: 'An incident was reported at Warehouse 3.',
      timestamp: '20 minutes ago',
      isRead: false,
      actionLink: '/reports',
      actionLinkText: 'View Report →',
    },
    {
      id: '3',
      type: 'ACTION',
      title: 'Action Assigned',
      description: 'ACT-0045 has been assigned to John Doe.',
      timestamp: '1 hour ago',
      isRead: true,
      actionLink: '/actions',
      actionLinkText: 'View Report →',
    },
    {
      id: '4',
      type: 'ACTION',
      title: 'Action In Progress',
      description: 'ACT-0043 has been started by John Doe.',
      timestamp: '2 hour ago',
      isRead: true,
      actionLink: '/actions',
      actionLinkText: 'View Report →',
    },
    {
      id: '5',
      type: 'ACTION',
      title: 'Action Completed',
      description: 'ACT-0045 has been marked as completed.',
      timestamp: 'Yesterday, 10:31',
      isRead: true,
      actionLink: '/actions',
      actionLinkText: 'View Report →',
    },
    {
      id: '6',
      type: 'SYSTEM',
      title: 'System Update',
      description: 'New safety analytics features have been added.',
      timestamp: 'Last week',
      isRead: true,
    },
  ]);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  const getNotificationLink = (type: Notification['type']) => {
    switch (type) {
      case 'REPORT':
        return '/reports';
      case 'ACTION':
        return '/actions';
      case 'SYSTEM':
        return '/settings';
      default:
        return '';
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
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        role={role}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Notification"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={isMobile}
          userName={role === 'supervisor' ? 'John Matthew' : 'Peter Omorogbolahan'}
          userRole={role === 'supervisor' ? 'Supervisor' : 'System Administrator'}
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notification</h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage system updates and alerts</p>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      !notification.isRead
                        ? 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-700 shadow-sm'
                        : 'bg-[#FFF9F5] dark:bg-gray-800/30 border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
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

                          {/* Unread Indicator */}
                          {!notification.isRead && (
                            <div className="flex-shrink-0 w-2 h-2 bg-[#C24438] dark:bg-orange-500 rounded-full mt-1"></div>
                          )}
                        </div>

                        {/* Action Link */}
                        {notification.actionLink && (
                          <a
                            href={notification.actionLink}
                            className="text-sm font-medium text-[#C24438] dark:text-orange-500 hover:text-[#A63830] dark:hover:text-orange-400 mt-3 inline-block transition-colors"
                          >
                            {notification.actionLinkText}
                          </a>
                        )}
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
        </main>
      </div>
    </div>
  );
};
