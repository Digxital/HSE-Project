import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { reportService } from '@/services/reportService';
import { authService } from '@/services/authService';

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
  role: 'Admin' | 'Supervisor';
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
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Helper to load saved comments from localStorage
  const loadSavedComments = (): Record<string, Comment[]> => {
    try {
      const saved = localStorage.getItem('aegix_report_comments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Helper to save comments to localStorage
  const saveCommentsToStorage = (reportId: string, comments: Comment[]) => {
    try {
      const saved = loadSavedComments();
      saved[reportId] = comments;
      localStorage.setItem('aegix_report_comments', JSON.stringify(saved));
    } catch (err) {
      console.error('Failed to save comments to localStorage:', err);
    }
  };

  // Merge saved and suggested actions into fetched reports
  const mergeWithActionsAndComments = (fetchedReports: Report[]): Report[] => {
    const savedActions = loadSavedActions();
    const savedComments = loadSavedComments();
    const closedReportIds = loadClosedReports();
    
    return fetchedReports.map(report => {
      // Check if report is closed in localStorage
      const isClosed = closedReportIds.includes(report.id);
      
      // Merge actions: suggested + API + user-created
      const suggestedActions = generateSuggestedActions(report);
      const userCreatedActions = (savedActions[report.id] || []).filter(a => a.type === 'User-Created');
      
      // Combine all actions
      let allActions = [...suggestedActions, ...report.actions, ...userCreatedActions];
      
      // If report is closed, mark all actions as Completed
      if (isClosed) {
        allActions = allActions.map(action => ({
          ...action,
          status: 'Completed' as ActionStatus
        }));
        console.log(`🔒 Report ${report.id} is closed - marking ${allActions.length} actions as Completed`);
      }
      
      // Merge comments
      const savedCommentsList = savedComments[report.id];
      let finalComments = report.comments;
      if (savedCommentsList && savedCommentsList.length > 0) {
        const existingIds = new Set(report.comments.map(c => c.id));
        const newComments = savedCommentsList.filter(c => !existingIds.has(c.id));
        finalComments = [...newComments, ...report.comments];
      }
      
      return {
        ...report,
        status: isClosed ? 'Closed' : report.status,
        actions: allActions,
        comments: finalComments,
      };
    });
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getReports();
      setReports(mergeWithActionsAndComments(data));
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

  // Load closed reports from localStorage
  const loadClosedReports = (): string[] => {
    try {
      const stored = localStorage.getItem('aegix_report_closed');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load closed reports:', e);
      return [];
    }
  };

  // Save closed reports to localStorage
  const saveClosedReportsToStorage = (closedReportIds: string[]) => {
    try {
      localStorage.setItem('aegix_report_closed', JSON.stringify(closedReportIds));
      // Emit storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'aegix_report_closed',
        newValue: JSON.stringify(closedReportIds),
      }));
    } catch (e) {
      console.error('Failed to save closed reports:', e);
    }
  };

  // Listen for localStorage changes from other tabs (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aegix_report_comments' || e.key === 'aegix_report_actions' || e.key === 'aegix_report_closed') {
        // Comments, actions, or closed status changed in another tab - refresh reports to pick up changes
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

    // Save to localStorage - this marks the report as closed
    const closedReports = loadClosedReports();
    if (!closedReports.includes(reportId)) {
      closedReports.push(reportId);
      saveClosedReportsToStorage(closedReports);
      console.log(`💾 Report ${reportId} marked as closed in localStorage`);
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

    // Optimistic update
    const newComment: Comment = {
      id: `CMT-${Date.now()}`,
      author: role === 'supervisor' ? 'John Matthew' : 'Peter Omorogbolahan',
      role: role === 'supervisor' ? 'Supervisor' : 'Admin',
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
          // Persist to localStorage
          saveCommentsToStorage(reportId, updatedComments);
          return { ...r, comments: updatedComments };
        }
        return r;
      })
    );

    if (backendId) {
      try {
        await reportService.addComment(backendId, text, role);
      } catch (err) {
        console.error('Failed to add comment on server:', err);
      }
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
    <ReportsContext.Provider value={{ reports, loading, error, refreshReports: fetchReports, closeReport, addComment, addAction }}>
      {children}
    </ReportsContext.Provider>
  );
};
