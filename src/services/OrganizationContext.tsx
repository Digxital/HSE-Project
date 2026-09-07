import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { organizationService, type Organization } from '@/services/organizationService';
import { getAuthToken, getSuperAdminAuthToken } from '@/utils/authStorage';

const getOrganizationSessionToken = () => getSuperAdminAuthToken() || getAuthToken();

export type { Organization };

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
    if (!getOrganizationSessionToken()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await organizationService.getOrganizations(1, 50);
      const orgs = response.data.organizations || [];
      setOrganizations(orgs);
      hasLoadedOrganizationsRef.current = true;
    } catch (err: any) {
      // Never call handleLogout from here — this runs on a background poll.
      // A 401 during polling (e.g. backend restart) must not kick the user out mid-session.
      // Only explicit user-triggered actions in organizationService should redirect on 401.
      setError(err?.status === 401 ? 'session_expired' : 'Failed to load organizations from server');
      if (err?.status !== 401) setOrganizations(initialOrganizations);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount if authenticated
  useEffect(() => {
    const token = getOrganizationSessionToken();
    if (token) {
      fetchOrganizations();
    } else {
      setLoading(false);
    }
  }, [fetchOrganizations]);

  // Refresh data when user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && getOrganizationSessionToken()) {
        fetchOrganizations();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchOrganizations]);

  // Listen for auth events (login/logout)
  useEffect(() => {
    const handleLogin = () => {
      fetchOrganizations();
    };

    const handleAuthLogout = () => {
      setOrganizations([]);
      setLoading(false);
      setError(null);
      hasLoadedOrganizationsRef.current = false;
    };

    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [fetchOrganizations]);

  // Polling every 2 minutes — skip while tab is hidden to prevent queued-burst on return
  useEffect(() => {
    const token = getOrganizationSessionToken();
    if (!token) return;

    const intervalId = setInterval(() => {
      if (!document.hidden && getOrganizationSessionToken()) {
        fetchOrganizations();
      }
    }, 120000);

    return () => clearInterval(intervalId);
  }, [fetchOrganizations]);

  // Listen for custom organization update events (with debounce)
  useEffect(() => {
    const handleOrganizationUpdated = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(() => {
        fetchOrganizations();
      }, 800);
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
