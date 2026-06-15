// contexts/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationService, type Notification } from '@/services/notificationService';

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

    const intervalId = setInterval(fetchLatest, 10000); // Poll every 10 seconds for faster updates

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