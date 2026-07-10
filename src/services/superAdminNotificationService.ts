import { apiBaseUrl } from '@/lib/axios';
import { getAuthToken, getSuperAdminAuthToken } from '@/utils/authStorage';

export interface SuperAdminNotification {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  data?: {
    demoRequestId?: string;
    [key: string]: unknown;
  };
}

interface NotificationsResponse {
  success: boolean;
  message: string;
  data: SuperAdminNotification[];
}

interface MarkAsReadResponse {
  success: boolean;
  message: string;
  data: SuperAdminNotification;
}

// Deliberately bypasses the shared axios instance (`@/lib/axios`) — its request
// interceptor always attaches the generic auth_token, never superadmin_auth_token.
// Superadmin-scoped endpoints need the superadmin token specifically, the same
// way organizationService.ts already does it.
const getHeaders = () => {
  const token = getSuperAdminAuthToken() || getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

interface RequestError extends Error {
  status?: number;
}

const logAuthDiagnostics = (status: number, endpoint: string) => {
  if (status !== 401) return;
  const preview = (t: string | null) => (t ? `${t.slice(0, 12)}…(${t.length} chars)` : 'null');
  console.warn(
    `[superAdminNotificationService] 401 from ${endpoint}.`,
    'superadmin_auth_token:', preview(getSuperAdminAuthToken()),
    'auth_token (fallback):', preview(getAuthToken())
  );
};

export const superAdminNotificationService = {
  async fetchNotifications(): Promise<SuperAdminNotification[]> {
    const response = await fetch(`${apiBaseUrl}/api/superadmin/notifications`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      logAuthDiagnostics(response.status, '/api/superadmin/notifications');
      const error: RequestError = new Error(`Failed to fetch notifications (${response.status})`);
      error.status = response.status;
      throw error;
    }
    const data: NotificationsResponse = await response.json();
    return data?.data ?? [];
  },

  async markAsRead(id: string): Promise<SuperAdminNotification | null> {
    const response = await fetch(`${apiBaseUrl}/api/superadmin/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    if (!response.ok) {
      logAuthDiagnostics(response.status, `/api/superadmin/notifications/${id}/read`);
      const error: RequestError = new Error(`Failed to mark notification as read (${response.status})`);
      error.status = response.status;
      throw error;
    }
    const data: MarkAsReadResponse = await response.json();
    return data?.data ?? null;
  },
};
