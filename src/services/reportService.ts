import api from '@/lib/axios';
import type { Report, Action, Comment } from '@/services/ReportsContext';
import { generateDisplayId } from '@/services/idGenerator';

// Backend API response types
interface ApiLocation {
  clientId?: { _id: string; name: string };
  siteId?: { _id: string; name: string };
  specificArea?: string;
}

interface ApiReport {
  _id: string;
  recordType: 'hazard' | 'incident';
  title: string;
  description: string;
  riskLevel: 'high' | 'medium' | 'low';
  status: 'open' | 'in progress' | 'closed';
  eventDate: string;
  eventTime: string;
  peopleAffected: number;
  injuryDetails: string;
  equipmentInvolved: string;
  attachments: string[];
  createdAt: string;
  location: ApiLocation;
  reportedBy: {
    userId: { _id: string; email: string };
    role: string;
  };
  displayId?: string; // Will be provided by backend in future
  actions?: ApiAction[];
  comments?: ApiComment[];
}

interface ApiAction {
  _id: string;
  actionTitle: string;
  assignedTo: string;
  dueDate: string;
  status: 'open' | 'in progress' | 'completed';
}

interface ApiComment {
  _id: string;
  author: string;
  role: string;
  text: string;
  createdAt: string;
}

function formatLocation(location: ApiLocation): string {
  const parts: string[] = [];
  if (location.siteId?.name) parts.push(location.siteId.name);
  if (location.specificArea) parts.push(location.specificArea);
  return parts.join(' - ') || 'Unknown Location';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + '\n' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function mapRiskLevel(risk: string): 'High' | 'Medium' | 'Low' {
  const map: Record<string, 'High' | 'Medium' | 'Low'> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return map[risk.toLowerCase()] || 'Medium';
}

function mapStatus(status: string): 'Open' | 'In Progress' | 'Closed' {
  const map: Record<string, 'Open' | 'In Progress' | 'Closed'> = {
    'open': 'Open',
    'in progress': 'In Progress',
    'closed': 'Closed',
  };
  return map[status.toLowerCase()] || 'Open';
}

function mapActionStatus(status: string): 'Open' | 'In Progress' | 'Completed' {
  const map: Record<string, 'Open' | 'In Progress' | 'Completed'> = {
    'open': 'Open',
    'in progress': 'In Progress',
    'completed': 'Completed',
  };
  return map[status.toLowerCase()] || 'Open';
}

function mapApiReportToReport(apiReport: ApiReport): Report {
  const type = apiReport.recordType === 'hazard' ? 'Hazard' : 'Incident';

  // Generate display ID using the idGenerator service
  // When backend provides displayId field, this will automatically use it
  const displayId = generateDisplayId(apiReport);

  const actions: Action[] = (apiReport.actions || []).map((a, i) => ({
    id: a._id || `ACT-${String(i + 1).padStart(3, '0')}`,
    action: a.actionTitle,
    assignedTo: a.assignedTo,
    dueDate: a.dueDate,
    status: mapActionStatus(a.status),
  }));

  const comments: Comment[] = (apiReport.comments || []).map((c, i) => ({
    id: c._id || `CMT-${String(i + 1).padStart(3, '0')}`,
    author: c.author,
    role: (c.role === 'Admin' || c.role === 'Supervisor') ? c.role : 'Admin',
    text: c.text,
    timestamp: c.createdAt ? formatDate(c.createdAt) : '',
  }));

  return {
    id: displayId,
    _id: apiReport._id,
    type,
    category: apiReport.title,
    description: apiReport.description,
    location: formatLocation(apiReport.location || {}),
    risk: mapRiskLevel(apiReport.riskLevel),
    status: mapStatus(apiReport.status),
    dateReported: formatDate(apiReport.createdAt),
    reportedBy: apiReport.reportedBy?.userId?.email || 'Unknown',
    equipmentInvolved: apiReport.equipmentInvolved || 'None',
    actions,
    comments,
  };
}

export const reportService = {
  async getReports(): Promise<Report[]> {
    const response = await api.get('/api/reports');
    const apiReports: ApiReport[] = Array.isArray(response.data)
      ? response.data
      : response.data.reports || response.data.data || [];

    return apiReports.map((r) => mapApiReportToReport(r));
  },

  async closeReport(reportId: string): Promise<void> {
    await api.patch(`/api/reports/${reportId}`, { status: 'closed' });
  },

  async addComment(reportId: string, text: string, role: string): Promise<void> {
    await api.post(`/api/reports/${reportId}/comment`, { text, role });
  },

  async addAction(reportId: string, actionData: {
    actionTitle: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    description: string;
  }): Promise<void> {
    await api.post(`/api/reports/${reportId}/action`, actionData);
  },
};
