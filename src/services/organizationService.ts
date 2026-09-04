import { getAuthToken, getSuperAdminAuthToken } from '@/utils/authStorage';
import { handleLogout, isSuperAdminTokenValid } from './superAdminAuthService';
import { apiBaseUrl as API_BASE_URL } from '@/lib/axios';

export interface Organization {
  _id: string;
  organizationName: string;
  organizationId: string;
  primaryContactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  organizationAddress: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
  subscriptionPlan: string;
  dataRetentionPeriod: string;
  // Backend returns the literal string "Unlimited" for the Enterprise plan, a number otherwise.
  maximumAllowedUsers: number | string;
  reportsStorageLimit: number | string;
  currentUsersCount: number;
  currentReportsCount: number;
  createdAt: string;
  updatedAt: string;
  logo?: { url: string; filename?: string; originalName?: string; mimetype?: string; size?: number; uploadedAt?: string };
}

export interface CreateOrganizationPayload {
  organizationName: string;
  primaryContactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  organizationAddress: string;
  password: string;
  subscriptionPlan: string;
  dataRetentionPeriod: string;
  logo?: File | null;
}

export interface OrganizationsResponse {
  success: boolean;
  message: string;
  data: {
    organizations: Organization[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface OrganizationResponse {
  success: boolean;
  message: string;
  data: Organization;
}

class OrganizationService {
  private normalizeCreatePayload(payload: CreateOrganizationPayload): CreateOrganizationPayload {
    return {
      ...payload,
      organizationName: payload.organizationName.trim(),
      primaryContactPersonName: payload.primaryContactPersonName.trim(),
      contactEmail: payload.contactEmail.trim().toLowerCase(),
      contactPhoneNumber: payload.contactPhoneNumber.trim(),
      organizationAddress: payload.organizationAddress.trim(),
      password: payload.password,
    };
  }

  private async parseErrorMessage(response: Response, fallback: string): Promise<string> {
    const contentType = response.headers.get('content-type') || '';
    try {
      if (contentType.includes('application/json')) {
        const error = await response.json();
        return error?.message || error?.error || fallback;
      }
      const text = await response.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }

  private getHeaders() {
    const token = getSuperAdminAuthToken() || getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Mirrors how the regular admin flow decides to log out (authService.isAuthenticated()
  // in App.tsx's checkAuth): trust the token's own exp claim as the source of truth,
  // rather than any single endpoint's 401. Some superadmin routes have been observed
  // returning a spurious 401 while the token is still valid for hours — logging the
  // user out on every one of those was the "unexpected redirect to superadmin login" bug.
  private handleUnauthorized(): never {
    const preview = (t: string | null) => (t ? `${t.slice(0, 12)}…(${t.length} chars)` : 'null');

    if (!isSuperAdminTokenValid()) {
      console.warn('Token expired or invalid. Logging out...');
      handleLogout();
      throw new Error('Session expired. Please log in again.');
    }

    console.warn(
      '[organizationService] Got a 401 but the local superadmin token is still valid — not logging out (likely a transient backend issue).',
      'superadmin_auth_token:', preview(getSuperAdminAuthToken()),
      'auth_token (fallback):', preview(getAuthToken())
    );
    throw new Error('Something went wrong. Please try again.');
  }

  async createOrganization(payload: CreateOrganizationPayload): Promise<OrganizationResponse> {
    try {
      const normalizedPayload = this.normalizeCreatePayload(payload);
      const formData = new FormData();
      formData.append('organizationName', normalizedPayload.organizationName);
      formData.append('primaryContactPersonName', normalizedPayload.primaryContactPersonName);
      formData.append('contactEmail', normalizedPayload.contactEmail);
      formData.append('contactPhoneNumber', normalizedPayload.contactPhoneNumber);
      formData.append('organizationAddress', normalizedPayload.organizationAddress);
      formData.append('password', normalizedPayload.password);
      formData.append('subscriptionPlan', normalizedPayload.subscriptionPlan);
      formData.append('dataRetentionPeriod', normalizedPayload.dataRetentionPeriod);
      if (normalizedPayload.logo) {
        formData.append('logo', normalizedPayload.logo);
      }

      const token = getSuperAdminAuthToken() || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // No Content-Type — browser sets multipart boundary automatically
        },
        body: formData,
      });

      if (response.status === 401) {
        this.handleUnauthorized();
      }

      if (!response.ok) {
        const message = await this.parseErrorMessage(response, 'Failed to create organization');
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  }

  async getOrganizations(page: number = 1, limit: number = 50): Promise<OrganizationsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/organizations?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (response.status === 401) {
        const preview = (t: string | null) => (t ? `${t.slice(0, 12)}…(${t.length} chars)` : 'null');
        console.warn(
          '[organizationService] 401 from /api/organizations.',
          'localTokenStillValid:', isSuperAdminTokenValid(),
          'superadmin_auth_token:', preview(getSuperAdminAuthToken()),
          'auth_token (fallback):', preview(getAuthToken())
        );
        // Throw with status attached — let OrganizationContext decide whether to logout
        // (don't auto-logout here: this method is used by background polling)
        const err = new Error('Session expired. Please log in again.') as any;
        err.status = 401;
        throw err;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch organizations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  }

  async getOrganizationById(id: string): Promise<OrganizationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/organizations/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      // Handle unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch organization');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error;
    }
  }

  async updateOrganizationStatus(id: string, action: 'deactivate' | 'activate'): Promise<OrganizationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/organizations/${id}/${action}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      // Handle unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${action} organization`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating organization status (${action}):`, error);
      throw error;
    }
  }

  async deleteOrganization(id: string): Promise<OrganizationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/organizations/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      // Handle unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete organization');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  }
}

export const organizationService = new OrganizationService();
