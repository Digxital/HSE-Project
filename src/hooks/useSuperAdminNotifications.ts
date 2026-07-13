import { useCallback, useEffect, useRef, useState } from 'react';
import {
  superAdminNotificationService,
  type SuperAdminNotification,
} from '@/services/superAdminNotificationService';
import {
  getSuperAdminNotificationPreferences,
  SUPERADMIN_NOTIFICATION_PREFERENCES_CHANGED_EVENT,
  type SuperAdminNotificationPreferences,
} from '@/utils/superAdminNotificationPreferences';

const POLL_INTERVAL_MS = 60000;
const MAX_BACKOFF_MS = 10 * 60000; // cap retries at 10 minutes apart after repeated failures

// Display filter only — every notification is still fetched and stored; this
// just decides what's shown. demo_request_submitted is the only type today,
// and it's what "organization notifications" means in practice. Anything
// else always shows, since there's no toggle for it yet.
const isNotificationVisible = (
  notification: SuperAdminNotification,
  prefs: SuperAdminNotificationPreferences
) => {
  if (notification.type === 'demo_request_submitted' && !prefs.receiveOrgNotifications) return false;
  return true;
};

export const useSuperAdminNotifications = () => {
  const [notifications, setNotifications] = useState<SuperAdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<SuperAdminNotificationPreferences>(
    getSuperAdminNotificationPreferences
  );
  const consecutiveFailuresRef = useRef(0);

  const refresh = useCallback(async () => {
    if (document.hidden) return;
    if (!window.location.pathname.startsWith('/superadmin')) return;

    try {
      const data = await superAdminNotificationService.fetchNotifications();
      setNotifications(
        [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      );
      consecutiveFailuresRef.current = 0;
    } catch (error) {
      consecutiveFailuresRef.current += 1;
      console.error(
        `Failed to fetch superadmin notifications (attempt ${consecutiveFailuresRef.current}):`,
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number;

    // Self-scheduling poll instead of a fixed setInterval — repeated failures
    // (e.g. a transient 401) push the next attempt further out instead of
    // hammering the backend every 60s indefinitely.
    const tick = async () => {
      await refresh();
      if (cancelled) return;
      const delay =
        consecutiveFailuresRef.current > 0
          ? Math.min(POLL_INTERVAL_MS * 2 ** consecutiveFailuresRef.current, MAX_BACKOFF_MS)
          : POLL_INTERVAL_MS;
      timeoutId = window.setTimeout(tick, delay);
    };

    tick();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [refresh]);

  // Live-update if the Settings page (mounted elsewhere in the same tab)
  // changes preferences — localStorage alone doesn't trigger a re-render here.
  useEffect(() => {
    const handlePreferencesChanged = () => setPreferences(getSuperAdminNotificationPreferences());
    window.addEventListener(SUPERADMIN_NOTIFICATION_PREFERENCES_CHANGED_EVENT, handlePreferencesChanged);
    return () =>
      window.removeEventListener(SUPERADMIN_NOTIFICATION_PREFERENCES_CHANGED_EVENT, handlePreferencesChanged);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await superAdminNotificationService.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // No batch endpoint exists yet — fire a PATCH per unread notification.
  // Only marks notifications currently visible under preferences — no reason
  // to mark something read that the user was never shown.
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const unreadIds = prev
        .filter((n) => !n.read && isNotificationVisible(n, preferences))
        .map((n) => n.id);
      unreadIds.forEach((id) => {
        superAdminNotificationService.markAsRead(id).catch((error) => {
          console.error('Failed to mark notification as read:', error);
        });
      });
      return prev.map((n) => (unreadIds.includes(n.id) ? { ...n, read: true } : n));
    });
  }, [preferences]);

  // Every notification is still fetched/stored — this only filters what's shown.
  const visibleNotifications = notifications.filter((n) => isNotificationVisible(n, preferences));
  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  return { notifications: visibleNotifications, unreadCount, loading, markAsRead, markAllAsRead, refresh };
};
