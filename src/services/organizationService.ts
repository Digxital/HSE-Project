import { getAuthToken } from '@/utils/authStorage';
import { handleLogout } from './superAdminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Organization {
  _id: string;
  organizationName: string;
  organizationId: string;
  primaryContactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  organizationAddress: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationPayload {
  organizationName: string;
  primaryContactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  organizationAddress: string;
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
  private getHeaders() {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async createOrganization(payload: CreateOrganizationPayload): Promise<OrganizationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      // Handle unauthorized
      if (response.status === 401) {
        console.warn('Token expired or invalid. Logging out...');
        handleLogout();
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create organization');
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

      // Handle unauthorized - token expired or invalid
      if (response.status === 401) {
        console.warn('Token expired or invalid. Logging out...');
        handleLogout();
        throw new Error('Session expired. Please log in again.');
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
        console.warn('Token expired or invalid. Logging out...');
        handleLogout();
        throw new Error('Session expired. Please log in again.');
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
        console.warn('Token expired or invalid. Logging out...');
        handleLogout();
        throw new Error('Session expired. Please log in again.');
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
        console.warn('Token expired or invalid. Logging out...');
        handleLogout();
        throw new Error('Session expired. Please log in again.');
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
