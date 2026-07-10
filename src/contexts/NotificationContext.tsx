// contexts/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationService, type Notification } from '@/services/notificationService';
import { isPublicRoute } from '@/utils/routeGuards';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
} 

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
 
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const useOptionalNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    const fetchLatest = () => {
      // SuperAdmin has its own separate notification feed — never poll
      // /api/notifications here, it's scoped to admin/supervisor accounts.
      if (window.location.pathname.startsWith('/superadmin')) return;
      // Landing page / login screens have no session — don't poll with
      // whatever stale token might be sitting in storage.
      if (isPublicRoute()) return;
      notificationService.fetchNotifications();
    };
    fetchLatest();

    const handleLogin = () => fetchLatest();
    const handleLogout = () => {
      notificationService.clearAll();
    };
    const handleFocus = () => {
      fetchLatest();
    };

    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('focus', handleFocus);

    // Poll every 10 seconds so new reports/actions/comments from the mobile
    // app show up in the bell without a full page reload.
    const intervalId = setInterval(() => {
      if (!document.hidden) fetchLatest();
    }, 10000);

    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    notificationService.addNotification(notification);
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};