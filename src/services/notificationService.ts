// services/notificationService.ts
import api from '@/lib/axios';
import { getAuthToken } from '@/utils/authStorage';

export interface Notification {
  id: string;
  type: 'user_added' | 'report_submitted' | 'report_commented' | 'action_closed' | 'action_progress';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  readAt?: number;
  data?: any;
}

class NotificationService {
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private notifications: Notification[] = [];
  private cleanupIntervalId: ReturnType<typeof setInterval> | null = null;
  private readonly readRetentionMs = 30 * 60 * 1000;

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    listener(this.notifications);
    this.ensureCleanupTimer();
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
    };
    
    this.notifications = [newNotification, ...this.notifications];
    this.notifyListeners();
    
    // Optional: Send to backend
    this.syncToBackend(newNotification);
    
    return newNotification;
  }

  // Mark notification as read
  async markAsRead(id: string) {
    const now = Date.now();
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true, readAt: n.readAt || now } : n
    );
    this.removeExpiredReadNotifications();
    this.notifyListeners();

    try {
      const token = getAuthToken();
      if (!token) return;
      await api.patch(`/api/notifications/${id}/read`, { read: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Failed to mark notification as read on server:', error);
    }
  }

  // Mark all as read
  async markAllAsRead() {
    const now = Date.now();
    this.notifications = this.notifications.map(n => ({ ...n, read: true, readAt: n.readAt || now }));
    this.removeExpiredReadNotifications();
    this.notifyListeners();

    try {
      const token = getAuthToken();
      if (!token) return;
      await api.patch('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read on server:', error);
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Load notifications from backend
  async fetchNotifications() {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const response = await api.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = response.data;
      const rawList = Array.isArray(payload)
        ? payload
        : payload?.data || payload?.notifications || payload?.results || payload?.items || payload?.records || [];

      const list = Array.isArray(rawList)
        ? rawList
        : Array.isArray(rawList?.data)
        ? rawList.data
        : rawList && typeof rawList === 'object'
        ? [rawList]
        : [];

      if (!Array.isArray(list)) {
        return [];
      }

      const now = Date.now();
      const mapped = list.map((item: any) => {
        const rawTimestamp = item.timestamp || item.createdAt || item.updatedAt;
        const parsedTimestamp = rawTimestamp ? Date.parse(rawTimestamp) : NaN;
        const timestampMs = Number.isNaN(parsedTimestamp) ? now : parsedTimestamp;
        const formattedTimestamp = new Date(timestampMs).toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const rawReadAt = item.readAt || item.updatedAt || (item.read ? rawTimestamp : undefined);
        const parsedReadAt = rawReadAt ? Date.parse(rawReadAt) : undefined;
        const readAt = item.read ? (Number.isNaN(parsedReadAt || NaN) ? now : parsedReadAt) : undefined;

        return {
          id: item.id || item._id || item.notificationId || Math.random().toString(36).substr(2, 9),
          type: item.type || item.notificationType || 'system',
          title: item.title || item.message || 'Notification',
          description: item.description || item.details || '',
          timestamp: formattedTimestamp,
          read: item.read ?? item.isRead ?? false,
          readAt,
          data: item.data || item.metadata || item.payload,
          _rawTime: timestampMs,
        } as Notification & { _rawTime: number };
      });

      this.notifications = mapped
        .sort((a, b) => b._rawTime - a._rawTime)
        .map(({ _rawTime, ...rest }) => rest);

      this.removeExpiredReadNotifications();
      this.notifyListeners();
      return this.notifications;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  private removeExpiredReadNotifications() {
    const cutoff = Date.now() - this.readRetentionMs;
    this.notifications = this.notifications.filter(
      (notification) => !notification.read || !notification.readAt || notification.readAt >= cutoff
    );
  }

  private ensureCleanupTimer() {
    if (this.cleanupIntervalId) return;
    this.cleanupIntervalId = setInterval(() => {
      const beforeCount = this.notifications.length;
      this.removeExpiredReadNotifications();
      if (this.notifications.length !== beforeCount) {
        this.notifyListeners();
      }
    }, 5 * 60 * 1000);
  }

  private async syncToBackend(notification: Notification) {
    try {
      const token = getAuthToken();
      if (!token) return;

      const payload = {
        type: notification.type,
        title: notification.title,
        description: notification.description,
        read: notification.read,
        data: notification.data,
      };

      await api.post('/api/notifications', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to sync notification to backend:', error);
    }
  }
}

export const notificationService = new NotificationService();