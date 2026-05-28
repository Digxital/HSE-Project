import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOptionalReports } from '@/services/ReportsContext';
import { getUserData } from '@/utils/authStorage';

interface Notification {
  id: string;
  type: 'REPORT' | 'ACTION' | 'USER' | 'SYSTEM';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  targetId?: string;
  commentId?: string;
  userEmail?: string;
}

interface NotificationsPageProps {
  role?: 'admin' | 'supervisor';
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ role = 'admin' }) => {
  const navigate = useNavigate();
  const userData = getUserData();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const reportsApi = useOptionalReports();
  const reports = reportsApi?.reports ?? [];
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const routePrefix = role === 'supervisor' ? '/supervisor' : '';

  const displayName = userData?.name || 'User';
  const displayRole = userData?.role
    ? userData.role === 'supervisor'
      ? 'Supervisor'
      : 'System Administrator'
    : role === 'supervisor'
      ? 'Supervisor'
      : 'System Administrator';

  const formatReportTimestamp = (value?: string) => {
    if (!value) return null;
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return null;
    return new Date(parsed).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const mappedNotifications: Notification[] = notifications.map((notification) => {
    const emailMatch = typeof notification.description === 'string'
      ? notification.description.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
      : null;
    const userEmail = notification.data?.userEmail || notification.data?.email || notification.data?.user?.email || emailMatch?.[0];
    const hasReportTarget = Boolean(notification.data?.reportId || notification.data?.incidentId || notification.data?.report?.id);
    const hasActionTarget = Boolean(notification.data?.actionId || notification.data?.action?.id);
    const hasUserTarget = Boolean(notification.data?.userId || userEmail);
    const mappedType: Notification['type'] = hasReportTarget
      ? 'REPORT'
      : hasActionTarget
      ? 'ACTION'
      : hasUserTarget
      ? 'USER'
      : notification.type === 'report_submitted' || notification.type === 'report_commented'
      ? 'REPORT'
      : notification.type === 'action_closed' || notification.type === 'action_progress'
      ? 'ACTION'
      : notification.type === 'user_added'
      ? 'USER'
      : 'SYSTEM';

    const reportId =
      notification.data?.reportId ||
      notification.data?.incidentId ||
      notification.data?.report?.id ||
      undefined;

    const targetId =
      reportId ||
      notification.data?.actionId ||
      notification.data?.userId ||
      notification.data?.action?.id ||
      notification.data?.id;

    const relatedReport = reportId
      ? reports.find((report) => report.id === reportId || report._id === reportId)
      : undefined;
    const reportTimestamp = formatReportTimestamp(relatedReport?.rawCreatedAt);

    return {
      id: notification.id,
      type: mappedType,
      title: notification.title,
      description: notification.description,
      timestamp: reportTimestamp || notification.timestamp,
      isRead: notification.read,
      targetId,
      commentId: notification.data?.commentId,
      userEmail,
    };
  });

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



  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'REPORT':
        if (notification.targetId && notification.commentId) {
          return `${routePrefix}/reports?reportId=${notification.targetId}&commentId=${notification.commentId}`;
        }
        return notification.targetId ? `${routePrefix}/reports?reportId=${notification.targetId}` : `${routePrefix}/reports`;
      case 'ACTION':
        return notification.targetId ? `${routePrefix}/actions?actionId=${notification.targetId}` : `${routePrefix}/actions`;
      case 'USER':
        if (notification.targetId) {
          return `/users?userId=${notification.targetId}`;
        }
        if (notification.userEmail) {
          return `/users?email=${encodeURIComponent(notification.userEmail)}`;
        }
        return '/users';
      case 'SYSTEM':
        return `${routePrefix}/settings`;
      default:
        return '';
    }
  };

  const handleOpenNotification = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    const target = getNotificationLink(notification);
    if (target) {
      navigate(target);
    }
  };

  const getActionLabel = (type: Notification['type']) => {
    switch (type) {
      case 'REPORT':
        return 'View Report →';
      case 'ACTION':
        return 'View Action →';
      case 'USER':
        return 'View User →';
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
          userName={displayName}
          userRole={displayRole}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#FFFAF5] dark:bg-[#121212] rounded-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              {/* Page Header */}
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notification</h1>
                  <p className="text-gray-600 dark:text-gray-400">View and manage system updates and alerts</p>
                </div>
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
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
                    (() => {
                      const targetLink = getNotificationLink(notification);
                      return (
                    <div
                      key={notification.id}
                      onClick={() => handleOpenNotification(notification)}
                      className={`p-4 rounded-lg border transition-colors bg-white dark:bg-[#0D0D0D] border-gray-100 dark:border-gray-700 cursor-pointer ${
                        !notification.isRead ? 'shadow-sm' : ''
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

                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            notification.isRead
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                              : 'bg-[#C24438] dark:bg-orange-600 text-white'
                          }`}>
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                        </div>

                        {/* Action Link */}
                        {targetLink && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenNotification(notification);
                            }}
                            className="text-sm font-medium text-[#C24438] dark:text-orange-500 hover:text-[#A63830] dark:hover:text-orange-400 mt-3 inline-block transition-colors"
                          >
                            {getActionLabel(notification.type)}
                          </button>
                        )}
                      </div>
                    </div>
                    </div>
                      );
                    })()
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
