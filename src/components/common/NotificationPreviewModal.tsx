import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'REPORT' | 'ACTION' | 'USER' | 'SYSTEM' | 'ORGANIZATION';
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
  const isSuperAdmin = window.location.pathname.startsWith('/superadmin');
  const routePrefix = isSuperAdmin ? '/superadmin' : (isSupervisor ? '/supervisor' : '');

  if (!isOpen) return null;

  // Show only last 3 notifications
  const recentNotifications = notifications.slice(0, 3);

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
      case 'ORGANIZATION':
        return `${routePrefix}/notifications`;
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
        <div className="bg-white dark:bg-[#121212] px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notification</h3>
          <button
            onClick={() => {
              navigate(`${routePrefix}/notifications`);
              onClose();
            }}
            className="text-xs text-[#C2410C] hover:underline font-semibold"
          >
            See all
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto w-full p-2 space-y-2">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNavigate(notification)}
                className={`p-3 rounded-lg border border-gray-100 dark:border-gray-800 cursor-pointer shadow-sm ${
                  !notification.isRead ? 'bg-[#FFF4E64D] dark:bg-[#200500]/50' : 'bg-white dark:bg-[#111111]'
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'USER' ? 'text-gray-500 bg-gray-100' : 'text-white bg-[#C2410C]'}`}>
                    {notification.type === 'USER' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-sm font-bold truncate ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {notification.description}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
                      {notification.timestamp}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#C2410C] rounded-full mt-1.5"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">No notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
