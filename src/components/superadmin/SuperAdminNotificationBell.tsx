import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminNotifications } from '@/hooks/useSuperAdminNotifications';
import type { SuperAdminNotification } from '@/services/superAdminNotificationService';

const PREVIEW_COUNT = 5;

export const SuperAdminNotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading } = useSuperAdminNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    navigate('/superadmin/notifications');
  };

  // Route to the full notifications page and have it auto-open this specific
  // notification's detail modal, instead of just landing on the plain list.
  const handleNotificationClick = (notification: SuperAdminNotification) => {
    setIsOpen(false);
    navigate(`/superadmin/notifications?notificationId=${encodeURIComponent(notification.id)}`);
  };

  const previewNotifications = notifications.slice(0, PREVIEW_COUNT);

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Notifications"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 dark:bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[50]" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-16 right-4 md:right-8 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#121212] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
            </div>

            <div className="max-h-96 overflow-y-auto w-full p-2 space-y-2">
              {loading ? (
                <div className="p-6 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              ) : previewNotifications.length > 0 ? (
                previewNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      !notification.read ? 'bg-[#FFF4E64D] dark:bg-[#200500]/50' : 'bg-white dark:bg-[#111111]'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#C2410C]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-bold truncate text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {notification.description}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
                          {new Date(notification.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#C2410C] rounded-full mt-1.5"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">No notifications yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleSeeAll}
                className="w-full px-4 py-3 text-sm font-semibold text-[#C2410C] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                See all notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
