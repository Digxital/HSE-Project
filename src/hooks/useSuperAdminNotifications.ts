import { useCallback, useEffect, useRef, useState } from 'react';
import {
  superAdminNotificationService,
  type SuperAdminNotification,
} from '@/services/superAdminNotificationService';

const POLL_INTERVAL_MS = 60000;
const MAX_BACKOFF_MS = 10 * 60000; // cap retries at 10 minutes apart after repeated failures

export const useSuperAdminNotifications = () => {
  const [notifications, setNotifications] = useState<SuperAdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
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

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await superAdminNotificationService.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // No batch endpoint exists yet — fire a PATCH per unread notification.
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const unreadIds = prev.filter((n) => !n.read).map((n) => n.id);
      unreadIds.forEach((id) => {
        superAdminNotificationService.markAsRead(id).catch((error) => {
          console.error('Failed to mark notification as read:', error);
        });
      });
      return prev.map((n) => ({ ...n, read: true }));
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refresh };
};
