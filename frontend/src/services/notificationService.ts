// services/notificationService.ts
import api from '@/lib/axios';
import { getAuthToken } from '@/utils/authStorage';

export interface Notification {
  id: string;
  type: 'user_added' | 'report_submitted' | 'action_closed' | 'action_progress';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

class NotificationService {
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private notifications: Notification[] = [];

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    listener(this.notifications);
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
  markAsRead(id: string) {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notifyListeners();
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.notifyListeners();
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

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  private async syncToBackend(notification: Notification) {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      await api.post('/api/notifications', notification, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to sync notification to backend:', error);
    }
  }
}

export const notificationService = new NotificationService();