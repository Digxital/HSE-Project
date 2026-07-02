import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { reportService } from '@/services/reportService';
import { getUserData, getAuthToken } from '@/utils/authStorage';
import { useOptionalNotifications } from '@/contexts/NotificationContext';

// Types
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type ReportStatus = 'Open' | 'In Progress' | 'Closed';
export type ActionStatus = 'Open' | 'In Progress' | 'Completed';

export interface Action {
  id: string;
  action: string;
  assignedTo: string;
  dueDate: string;
  status: ActionStatus;
  type?: 'Suggested' | 'User-Created';
  priority?: 'High' | 'Medium' | 'Low' | string;
  description?: string;
  createdAt?: string;
  createdBy?: {
    id?: string;
    role?: string;
    email?: string;
  };
}
 
export interface Comment {
  id: string;
  author: string;
  role: 'Admin' | 'Supervisor' | 'Field User';
  text: string;
  timestamp: string;
}

export interface Report {
  id: string;
  _id?: string;
  type: 'Incident' | 'Hazard';
  category: string;
  description: string;
  location: string;
  risk: RiskLevel;
  status: ReportStatus;
  dateReported: string;
  rawCreatedAt?: string;
  reportedBy: string;
  equipmentInvolved: string;
  attachments?: string[];
  actions: Action[];
  comments: Comment[];
}

interface ReportsContextType {
  reports: Report[];
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
  closeReport: (reportId: string) => void;
  addComment: (reportId: string, text: string, role: 'admin' | 'supervisor') => void;
  deleteComment: (reportId: string, commentId: string) => void;
  updateActionStatus: (reportId: string, actionId: string, status: ActionStatus) => void;
  addAction: (reportId: string, actionData: {
    actionTitle: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    description: string;
  }) => void;
}

const ReportsContext = createContext<ReportsContextType | null>(null);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export const useOptionalReports = () => {
  return useContext(ReportsContext);
};

// Use only backend API data - no mock data
const initialReports: Report[] = [];

// Helper function to check if user is a SuperAdmin
const isSuperAdminUser = (): boolean => {
  // Route check is most reliable — superadmin token never has org-level access
  if (window.location.pathname.startsWith('/superadmin')) return true;
  const userData = getUserData();
  const role = userData?.role?.toLowerCase() ?? '';
  return (
    role === 'superadmin' ||
    role === 'super_admin' ||
    role === 'super admin' ||
    role === 'super-admin'
  );
};

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationApi = useOptionalNotifications();
  const addNotification = notificationApi?.addNotification ?? (() => {});
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousReportIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedReportsRef = useRef(false);
  const actionStatusOverridesRef = useRef<Map<string, ActionStatus>>(new Map());

  const mergeWithActionsAndComments = (fetchedReports: Report[]): Report[] => {
    return fetchedReports.map(report => ({
      ...report,
      actions: report.actions,
      comments: report.comments,
    }));
  };

  const applyActionStatusRules = (fetchedReports: Report[]): Report[] => {
    return fetchedReports.map((report) => {
      const updatedActions = report.actions.map((action) => {
        if (report.status === 'Closed') {
          return { ...action, status: 'Completed' as ActionStatus };
        }
        const overrideKey = `${report.id}:${action.id}`;
        const overrideStatus = actionStatusOverridesRef.current.get(overrideKey);
        return overrideStatus ? { ...action, status: overrideStatus } : action;
      });
      return { ...report, actions: updatedActions };
    });
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getReports();
      const mergedReports = mergeWithActionsAndComments(data);
      const normalizedReports = applyActionStatusRules(mergedReports);
      setReports(normalizedReports);

      if (hasLoadedReportsRef.current) {
        // Already loaded previously, skip notification logic
      } else {
        const lastSeenRaw = Number(localStorage.getItem('aegix_last_seen_reports_at') || 0);

        const latestCreatedAt = normalizedReports
          .map((report) => (report.rawCreatedAt ? Date.parse(report.rawCreatedAt) : 0))
          .reduce((max, value) => (value > max ? value : max), lastSeenRaw || 0);

        localStorage.setItem('aegix_last_seen_reports_at', String(latestCreatedAt || Date.now()));
      }

      previousReportIdsRef.current = new Set(normalizedReports.map((report) => report.id));
      hasLoadedReportsRef.current = true;
    } catch (err) {
      console.error('Failed to fetch reports from API, using fallback data:', err);
      setError('Failed to load reports from server');
      // Fallback to hardcoded data so the UI still works
      setReports(mergeWithActionsAndComments(initialReports));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip fetching reports if no token or user is a SuperAdmin
    if (!getAuthToken() || isSuperAdminUser()) {
      setLoading(false);
      return;
    }
    
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const handleLogin = () => {
      // Only refetch for admin/supervisor users, not SuperAdmin
      if (!isSuperAdminUser()) {
        fetchReports();
      }
    };

    const handleLogout = () => {
      setReports([]);
      setLoading(false);
      setError(null);
    };

    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [fetchReports]);

  useEffect(() => {
    // Skip polling for SuperAdmin users
    if (!getAuthToken() || isSuperAdminUser()) return;
    
    const intervalId = setInterval(() => {
      fetchReports();
    }, 120000);

    return () => clearInterval(intervalId);
  }, [fetchReports]);

  // Listen for localStorage changes from other tabs (cross-tab sync)
  useEffect(() => {
    // Skip for SuperAdmin users or when no token
    if (!getAuthToken() || isSuperAdminUser()) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aegix_last_seen_reports_at') {
        fetchReports();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchReports]);

  const closeReport = async (reportId: string) => {
    // Find the report to get its backend _id
    const report = reports.find(r => r.id === reportId);
    const backendId = report?._id;

    if (report) {
      report.actions.forEach((action) => {
        actionStatusOverridesRef.current.set(`${report.id}:${action.id}`, 'Completed');
      });
    }

    // Optimistic update - close report and mark all actions as completed
    setReports(prev =>
      prev.map(r =>
        r.id === reportId 
          ? { 
              ...r, 
              status: 'Closed' as ReportStatus,
              // Mark all actions as completed when report is closed
              actions: r.actions.map(action => ({
                ...action,
                status: 'Completed' as ActionStatus
              }))
            } 
          : r
      )
    );

    if (backendId) {
      try {
        await reportService.closeReport(backendId);
        console.log(`✅ Report ${reportId} closed on server`);
      } catch (err) {
        console.error('Failed to close report on server:', err);
        // Keep closed locally even if server fails
        console.log(`⚠️ Report ${reportId} closed locally (server sync pending)`);
      }
    }
  };

  const addComment = async (reportId: string, text: string, role: 'admin' | 'supervisor') => {
    const report = reports.find(r => r.id === reportId);
    const backendId = report?._id;

    const userData = getUserData();
    const authorName = userData?.name || (role === 'supervisor' ? 'Supervisor' : 'Admin');
    const authorRoleLabel = role === 'supervisor' ? 'Supervisor' : 'Admin';

    // Optimistic update
    const commentId = `CMT-${Date.now()}`;
    const newComment: Comment = {
      id: commentId,
      author: authorName,
      role: authorRoleLabel,
      text,
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ', ' + new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          const updatedComments = [newComment, ...r.comments];
          return { ...r, comments: updatedComments };
        }
        return r;
      })
    );

    if (report) {
      const currentEmail = userData?.email?.toLowerCase();
      const isSelfAction = Boolean(currentEmail);
      if (!isSelfAction) {
        addNotification({
          type: 'report_commented',
          title: `New comment on ${report.category}`,
          description: text,
          timestamp: newComment.timestamp,
          data: {
            reportId: report.id,
            commentId: commentId,
          },
        });
      }
    }

    if (backendId) {
      try {
        await reportService.addComment(backendId, text, role);
        await fetchReports();
      } catch (err) {
        console.error('Failed to add comment on server:', err);
        setError('Failed to save comment. Please try again.');
        setReports(prev =>
          prev.map(r => {
            if (r.id === reportId) {
              return { ...r, comments: r.comments.filter(c => c.id !== commentId) };
            }
            return r;
          })
        );
      }
    } else {
      setError('Comment saved locally but no server ID was found for this report.');
    }
  };

  const deleteComment = async (reportId: string, commentId: string) => {
    const report = reports.find(r => r.id === reportId);
    const backendId = report?._id;
    if (!report) return;

    const previousComments = report.comments;

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return { ...r, comments: r.comments.filter(c => c.id !== commentId) };
        }
        return r;
      })
    );

    if (backendId) {
      try {
        await reportService.deleteComment(backendId, commentId);
        await fetchReports();
      } catch (err) {
        console.error('Failed to delete comment on server:', err);
        setError('Failed to delete comment. Please try again.');
        setReports(prev =>
          prev.map(r => (r.id === reportId ? { ...r, comments: previousComments } : r))
        );
      }
    } else {
      setError('Comment deleted locally but no server ID was found for this report.');
    }
  };

  const updateActionStatus = (reportId: string, actionId: string, status: ActionStatus) => {
    actionStatusOverridesRef.current.set(`${reportId}:${actionId}`, status);
    setReports(prev =>
      prev.map(report => {
        if (report.id !== reportId) return report;
        const updatedActions = report.actions.map(action =>
          action.id === actionId ? { ...action, status } : action
        );
        return { ...report, actions: updatedActions };
      })
    );
  };

  const addAction = async (
    reportId: string,
    actionData: {
      actionTitle: string;
      assignedTo: string;
      dueDate: string;
      priority: string;
      description: string;
    }
  ) => {
    const report = reports.find(r => r.id === reportId);
    const backendId = report?._id;

    // Optimistic update
    const newActionId = `ACT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
    };

    const newAction: Action = {
      id: newActionId,
      action: actionData.actionTitle,
      assignedTo: actionData.assignedTo,
      dueDate: formatDate(actionData.dueDate),
      status: 'Open',
      type: 'User-Created',
    };

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          const updatedActions = [...r.actions, newAction];
          return { ...r, actions: updatedActions };
        }
        return r;
      })
    );

    if (backendId) {
      try {
        await reportService.addAction(backendId, actionData);
      } catch (err) {
        console.error('Failed to add action on server:', err);
      }
    }
  };

  return (
    <ReportsContext.Provider value={{ reports, loading, error, refreshReports: fetchReports, closeReport, addComment, deleteComment, updateActionStatus, addAction }}>
      {children}
    </ReportsContext.Provider>
  );
};
