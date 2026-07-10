import { apiBaseUrl } from '@/lib/axios';
import { getAuthToken, getSuperAdminAuthToken } from '@/utils/authStorage';

export interface DemoRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle?: string;
  country?: string;
  message?: string;
  requestedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface DemoRequestsResponse {
  success: boolean;
  message: string;
  data: {
    demoRequests: DemoRequest[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// Only ever called from the superadmin dashboard — deliberately bypasses the
// shared axios instance (`@/lib/axios`), whose request interceptor always
// attaches the generic auth_token, never superadmin_auth_token. Matches the
// pattern already used in organizationService.ts.
const getHeaders = () => {
  const token = getSuperAdminAuthToken() || getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const demoRequestService = {
  async fetchDemoRequests(): Promise<DemoRequest[]> {
    const response = await fetch(`${apiBaseUrl}/api/demo-request`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        const preview = (t: string | null) => (t ? `${t.slice(0, 12)}…(${t.length} chars)` : 'null');
        console.warn(
          '[demoRequestService] 401 from /api/demo-request.',
          'superadmin_auth_token:', preview(getSuperAdminAuthToken()),
          'auth_token (fallback):', preview(getAuthToken())
        );
      }
      throw new Error(`Failed to fetch demo requests (${response.status})`);
    }
    const data: DemoRequestsResponse = await response.json();
    return data?.data?.demoRequests ?? [];
  },

  // No single-item GET exists yet — resolve a notification's demoRequestId
  // against the full list until the backend adds one.
  async findById(id: string): Promise<DemoRequest | null> {
    const all = await this.fetchDemoRequests();
    return all.find((request) => request._id === id) ?? null;
  },
};
