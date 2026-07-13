import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { DemoRequestDetailModal } from '@/components/superadmin/DemoRequestDetailModal';
import { useSuperAdminNotifications } from '@/hooks/useSuperAdminNotifications';
import { demoRequestService, type DemoRequest } from '@/services/demoRequestService';
import { getSuperAdminUserData } from '@/utils/authStorage';
import type { SuperAdminNotification } from '@/services/superAdminNotificationService';

export const SuperAdminNotificationsPage: React.FC = () => {
  const { notifications, loading, markAsRead } = useSuperAdminNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const autoOpenedRef = useRef(false);

  const userData = getSuperAdminUserData();
  const displayName = userData?.name || 'Super Admin';
  const displayRole = userData?.role || 'Super Admin';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenNotification = async (notification: SuperAdminNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    const demoRequestId = notification.data?.demoRequestId;
    if (!demoRequestId) return;

    setLoadingDetailId(notification.id);
    try {
      const request = await demoRequestService.findById(demoRequestId);
      setSelectedRequest(request);
    } catch (error) {
      console.error('Failed to load demo request details:', error);
    } finally {
      setLoadingDetailId(null);
    }
  };

  // Arriving here from the bell dropdown (?notificationId=...) should open that
  // specific notification's modal automatically, not just land on the plain list.
  useEffect(() => {
    const targetId = searchParams.get('notificationId');
    if (!targetId || autoOpenedRef.current || loading) return;

    const target = notifications.find((n) => n.id === targetId);
    if (!target) return;

    autoOpenedRef.current = true;
    handleOpenNotification(target);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('notificationId');
      return next;
    }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, loading, searchParams]);

  return (
    <div className="min-h-screen bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors">
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      <SuperAdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <TopBar
          pageTitle="Notifications"
          userName={displayName}
          userRole={displayRole}
          syncStatus="synced"
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          showMenuButton={isMobile}
        />

        <main className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#FFFAF5] dark:bg-[#121212] rounded-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
                <p className="text-gray-600 dark:text-gray-400">System updates and demo request alerts</p>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleOpenNotification(notification)}
                      className={`p-4 rounded-lg border transition-colors bg-white dark:bg-[#0D0D0D] border-gray-100 dark:border-gray-700 cursor-pointer ${
                        !notification.read ? 'shadow-sm' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white bg-[#C2410C]">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {new Date(notification.timestamp).toLocaleString('en-US', {
                                  month: 'short',
                                  day: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>

                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              notification.read
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                : 'bg-[#C24438] dark:bg-orange-600 text-white'
                            }`}>
                              {notification.read ? 'Read' : 'Unread'}
                            </span>
                          </div>

                          {notification.data?.demoRequestId && (
                            <span className="text-sm font-medium text-[#C24438] dark:text-orange-500 mt-3 inline-block">
                              {loadingDetailId === notification.id ? 'Loading...' : 'View Details →'}
                            </span>
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
          </div>
        </main>
      </div>

      <DemoRequestDetailModal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  );
};
