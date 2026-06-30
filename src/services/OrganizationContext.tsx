import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { organizationService } from '@/services/organizationService';
import { getAuthToken } from '@/utils/authStorage';

// Types
export interface Organization {
  _id: string;
  organizationName: string;
  organizationId: string;
  primaryContactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  organizationAddress: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

interface OrganizationsContextType {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  refreshOrganizations: () => Promise<void>;
  getOrganizationStats: () => {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
}

// Safe default so useOrganizations never throws when context is temporarily unavailable
const defaultContextValue: OrganizationsContextType = {
  organizations: [],
  loading: true,
  error: null,
  refreshOrganizations: async () => {},
  getOrganizationStats: () => ({ total: 0, active: 0, pending: 0, suspended: 0 }),
};

const OrganizationsContext = createContext<OrganizationsContextType>(defaultContextValue);

export const useOrganizations = () => {
  return useContext(OrganizationsContext);
};

export const useOptionalOrganizations = () => {
  return useContext(OrganizationsContext);
};

const initialOrganizations: Organization[] = [];

export const OrganizationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOrganizationsRef = useRef(false);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchOrganizations = useCallback(async () => {
    try {
      console.log('[OrganizationContext] Fetching organizations...');
      setLoading(true);
      setError(null);
      const response = await organizationService.getOrganizations(1, 50);
      const orgs = response.data.organizations || [];
      console.log('[OrganizationContext] Fetched', orgs.length, 'organizations');
      setOrganizations(orgs);
      hasLoadedOrganizationsRef.current = true;
    } catch (err) {
      console.error('[OrganizationContext] Failed to fetch organizations from API:', err);
      setError('Failed to load organizations from server');
      setOrganizations(initialOrganizations);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount if authenticated
  useEffect(() => {
    console.log('[OrganizationContext] Mount: checking if should fetch organizations');
    const token = getAuthToken();
    console.log('[OrganizationContext] Auth token present:', !!token);
    if (token) {
      console.log('[OrganizationContext] Fetching organizations on mount');
      fetchOrganizations();
    } else {
      console.log('[OrganizationContext] No auth token, skipping fetch');
      setLoading(false);
    }
  }, [fetchOrganizations]);

  // Listen for auth events (login/logout)
  useEffect(() => {
    const handleLogin = () => {
      fetchOrganizations();
    };

    const handleLogout = () => {
      setOrganizations([]);
      setLoading(false);
      setError(null);
      hasLoadedOrganizationsRef.current = false;
    };

    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [fetchOrganizations]);

  // Polling every 2 minutes
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    console.log('[OrganizationContext] Starting 2-minute polling interval');
    const intervalId = setInterval(() => {
      console.log('[OrganizationContext] Polling: refreshing organizations');
      fetchOrganizations();
    }, 120000); // 2 minutes

    return () => {
      console.log('[OrganizationContext] Clearing polling interval');
      clearInterval(intervalId);
    };
  }, [fetchOrganizations]);

  // Listen for custom organization update events (with debounce)
  useEffect(() => {
    const handleOrganizationUpdated = () => {
      console.log('[OrganizationContext] Event: organizationUpdated - debouncing refresh');
      // Debounce the refresh to avoid too many requests
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(() => {
        console.log('[OrganizationContext] Debounce complete: refreshing organizations');
        fetchOrganizations();
      }, 800); // Increase debounce to 800ms to allow multiple rapid events to batch
    };

    const handleOrganizationDeleted = () => {
      handleOrganizationUpdated();
    };

    window.addEventListener('organizationUpdated', handleOrganizationUpdated);
    window.addEventListener('organizationDeleted', handleOrganizationDeleted);

    return () => {
      window.removeEventListener('organizationUpdated', handleOrganizationUpdated);
      window.removeEventListener('organizationDeleted', handleOrganizationDeleted);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [fetchOrganizations]);

  const getOrganizationStats = () => {
    return {
      total: organizations.length,
      active: organizations.filter(o => o.status === 'ACTIVE').length,
      pending: organizations.filter(o => o.status === 'PENDING').length,
      suspended: organizations.filter(o => o.status === 'SUSPENDED' || o.status === 'INACTIVE').length,
    };
  };

  const value: OrganizationsContextType = {
    organizations,
    loading,
    error,
    refreshOrganizations: fetchOrganizations,
    getOrganizationStats,
  };

  return (
    <OrganizationsContext.Provider value={value}>
      {children}
    </OrganizationsContext.Provider>
  );
};
