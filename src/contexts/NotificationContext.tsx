// contexts/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationService, type Notification } from '@/services/notificationService';
import { isPublicRoute } from '@/utils/routeGuards';
import {
  getNotificationPreferences,
  NOTIFICATION_PREFERENCES_CHANGED_EVENT,
  type NotificationPreferences,
} from '@/utils/notificationPreferences';

const REPORT_TYPES = new Set(['report_submitted', 'report_commented']);
const ACTION_TYPES = new Set(['action_assigned', 'action_closed', 'action_progress']);

// Display filter only — every notification is still fetched and stored;
// this just decides what's shown given the current preferences. Anything
// outside these two categories (e.g. user_added) always shows, since there's
// no toggle for it.
const isNotificationVisible = (notification: Notification, prefs: NotificationPreferences) => {
  if (REPORT_TYPES.has(notification.type) && !prefs.reportNotifications) return false;
  if (ACTION_TYPES.has(notification.type) && !prefs.actionUpdates) return false;
  return true;
};

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
  const [preferences, setPreferences] = useState<NotificationPreferences>(getNotificationPreferences);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    let isFetching = false;

    const fetchLatest = async () => {
      // SuperAdmin has its own separate notification feed — never poll
      // /api/notifications here, it's scoped to admin/supervisor accounts.
      if (window.location.pathname.startsWith('/superadmin')) return;
      // Landing page / login screens have no session — don't poll with
      // whatever stale token might be sitting in storage.
      if (isPublicRoute()) return;
      // A slow/stalled backend response must never be joined by an
      // overlapping poll — that piles up concurrent requests and can
      // saturate the browser's per-origin connection limit, stalling every
      // other request the page needs to make.
      if (isFetching) return;

      isFetching = true;
      try {
        await notificationService.fetchNotifications();
      } finally {
        isFetching = false;
      }
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

    // Poll every 20 seconds so new reports/actions/comments from the mobile
    // app show up in the bell without a full page reload.
    const intervalId = setInterval(() => {
      if (!document.hidden) fetchLatest();
    }, 20000);

    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  // Live-update if the Settings page (mounted elsewhere in the same tab)
  // changes preferences — localStorage alone doesn't trigger a re-render here.
  useEffect(() => {
    const handlePreferencesChanged = () => setPreferences(getNotificationPreferences());
    window.addEventListener(NOTIFICATION_PREFERENCES_CHANGED_EVENT, handlePreferencesChanged);
    return () => window.removeEventListener(NOTIFICATION_PREFERENCES_CHANGED_EVENT, handlePreferencesChanged);
  }, []);

  // Every notification is still fetched/stored — this only filters what's shown.
  const visibleNotifications = notifications.filter((n) => isNotificationVisible(n, preferences));
  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

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
        notifications: visibleNotifications,
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