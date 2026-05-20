import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { reportService } from '@/services/reportService';
import { getUserData } from '@/utils/authStorage';
import { authService } from '@/services/authService';
import { useNotifications } from '@/contexts/NotificationContext';

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
  reportedBy: string;
  equipmentInvolved: string;
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

// Use only backend API data - no mock data
const initialReports: Report[] = [];

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotifications();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousReportIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedReportsRef = useRef(false);

  // Helper to generate suggested actions from report attributes
  const generateSuggestedActions = (report: Report): Action[] => {
    const suggestedActions: Action[] = [];
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
    };

    if (report.risk === 'High') {
      suggestedActions.push({
        id: `ACT-SUGG-${report.id}-001`,
        action: 'Investigate and mitigate high-risk hazard',
        assignedTo: 'Safety Officer',
        dueDate: formatDate(nextWeek),
        status: 'Open',
        type: 'Suggested',
      });
    }

    if (report.risk === 'Medium') {
      suggestedActions.push({
        id: `ACT-SUGG-${report.id}-002`,
        action: 'Review and assess impact',
        assignedTo: 'Supervisor',
        dueDate: formatDate(nextWeek),
        status: 'Open',
        type: 'Suggested',
      });
    }

    if (report.type === 'Incident') {
      suggestedActions.push({
        id: `ACT-SUGG-${report.id}-003`,
        action: 'Review incident and document lessons learned',
        assignedTo: 'HSE Manager',
        dueDate: formatDate(nextWeek),
        status: 'Open',
        type: 'Suggested',
      });
    }

    if (report.status === 'Open') {
      suggestedActions.push({
        id: `ACT-SUGG-${report.id}-004`,
        action: 'Review and prioritize response',
        assignedTo: 'Operations Manager',
        dueDate: formatDate(nextWeek),
        status: 'Open',
        type: 'Suggested',
      });
    }

    return suggestedActions;
  };

  // Helper to load saved user-created actions from localStorage
  const loadSavedActions = (): Record<string, Action[]> => {
    try {
      const saved = localStorage.getItem('aegix_report_actions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Helper to save user-created actions to localStorage
  const saveActionsToStorage = (reportId: string, actions: Action[]) => {
    try {
      const saved = loadSavedActions();
      saved[reportId] = actions.filter(a => a.type === 'User-Created');
      localStorage.setItem('aegix_report_actions', JSON.stringify(saved));
    } catch (err) {
      console.error('Failed to save actions to localStorage:', err);
    }
  };

  // Merge suggested actions into fetched reports
  const mergeWithActionsAndComments = (fetchedReports: Report[]): Report[] => {
    const savedActions = loadSavedActions();
    
    return fetchedReports.map(report => {
      // Merge actions: suggested + API + user-created
      const suggestedActions = generateSuggestedActions(report);
      const userCreatedActions = (savedActions[report.id] || []).filter(a => a.type === 'User-Created');
      
      // Combine all actions
      let allActions = [...suggestedActions, ...report.actions, ...userCreatedActions];
      
      return {
        ...report,
        actions: allActions,
        comments: report.comments,
      };
    });
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getReports();
      const mergedReports = mergeWithActionsAndComments(data);
      setReports(mergedReports);

      if (hasLoadedReportsRef.current) {
        const currentUser = getUserData();
        const currentEmail = currentUser?.email?.toLowerCase();
        const previousIds = previousReportIdsRef.current;
        const newReports = mergedReports.filter((report) => !previousIds.has(report.id));
        newReports.forEach((report) => {
          const reporterEmail = report.reportedBy?.toLowerCase();
          if (currentEmail && reporterEmail && currentEmail === reporterEmail) return;

          addNotification({
            type: 'report_submitted',
            title: 'New report submitted',
            description: `${report.category} reported at ${report.location}`,
            timestamp: report.dateReported.replace('\n', ' '),
            data: {
              reportId: report.id,
            },
          });
        });
      }

      previousReportIdsRef.current = new Set(mergedReports.map((report) => report.id));
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
    if (authService.isAuthenticated()) {
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [fetchReports]);

  useEffect(() => {
    if (!authService.isAuthenticated()) return;
    const intervalId = setInterval(() => {
      fetchReports();
    }, 120000);

    return () => clearInterval(intervalId);
  }, [fetchReports]);

  // Listen for localStorage changes from other tabs (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aegix_report_actions') {
        // Actions changed in another tab - refresh reports to pick up changes
        console.log(`📢 ${e.key} updated in another tab, syncing...`);
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
          // Persist user-created actions to localStorage
          saveActionsToStorage(reportId, updatedActions);
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
    <ReportsContext.Provider value={{ reports, loading, error, refreshReports: fetchReports, closeReport, addComment, deleteComment, addAction }}>
      {children}
    </ReportsContext.Provider>
  );
};
