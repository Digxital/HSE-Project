import React from 'react';
import { useNavigate } from 'react-router-dom';

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

interface NotificationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
}

export const NotificationPreviewModal: React.FC<NotificationPreviewModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}) => {
  const navigate = useNavigate();
  const isSupervisor = window.location.pathname.startsWith('/supervisor');
  const routePrefix = isSupervisor ? '/supervisor' : '';

  if (!isOpen) return null;

  // Show only last 3 notifications
  const recentNotifications = notifications.slice(0, 3);
  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const handleNavigate = (notification: Notification) => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    navigate(getNotificationLink(notification));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[50]"
      onClick={onClose}
    >
      {/* Notification Dropdown */}
      <div
        className="absolute top-16 right-4 md:right-8 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#121212] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FFF9F5] dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-[#C24438] dark:bg-orange-600 text-white text-xs rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNavigate(notification)}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-white dark:bg-[#121212]' : 'bg-[#FFF9F5] dark:bg-gray-800/30'
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="flex-shrink-0 w-2 h-2 bg-[#C24438] dark:bg-orange-500 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-xs text-gray-600 dark:text-gray-400">No notifications</p>
            </div>
          )}
        </div>

        {/* Footer - See All Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-[#FFF9F5] dark:bg-gray-800">
          <button
            onClick={() => {
              navigate(`${routePrefix}/notifications`);
              onClose();
            }}
            className="w-full py-2 text-center text-sm font-medium text-[#C24438] dark:text-orange-500 hover:text-[#A63830] dark:hover:text-orange-400 transition-colors"
          >
            See All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
