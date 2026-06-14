import api, { apiBaseUrl } from '@/lib/axios';
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
  recordType?: 'hazard' | 'incident';
  recordCategory?: 'hazard' | 'incident';
  title: string;
  description: string;
  riskLevel: 'high' | 'medium' | 'low' | 'critical';
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
  adminComment?: ApiInlineComment[] | ApiInlineComment;
  supervisorComment?: ApiInlineComment[] | ApiInlineComment;
}

interface ApiAction {
  _id: string;
  actionTitle: string;
  assignedTo: string;
  dueDate: string;
  priority?: string;
  description?: string;
  status: 'open' | 'in progress' | 'completed';
  createdAt?: string;
  createdBy?: {
    id?: string;
    role?: string;
    email?: string;
  };
}

interface ApiComment {
  _id: string;
  author?: string;
  role?: string;
  text: string;
  createdAt?: string;
  commentedAt?: string;
  commentedBy?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
}

interface ApiInlineComment {
  _id?: string;
  text: string;
  commentedBy?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
  commentedAt?: string;
  role?: string;
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
    critical: 'High',
  };
  return map[risk.toLowerCase()] || 'Medium';
}

function mapStatus(status: string): 'Open' | 'In Progress' | 'Closed' {
  const map: Record<string, 'Open' | 'In Progress' | 'Closed'> = {
    'open': 'Open',
    'in progress': 'In Progress',
    'closed': 'Closed',
    'completed': 'Closed',
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
  const recordType = apiReport.recordType || apiReport.recordCategory || 'incident';
  const type = recordType === 'hazard' ? 'Hazard' : 'Incident';

  // Generate display ID using the idGenerator service
  // When backend provides displayId field, this will automatically use it
  const displayId = generateDisplayId({
    _id: apiReport._id,
    recordType,
    displayId: apiReport.displayId,
  });

  const actions: Action[] = (apiReport.actions || []).map((a, i) => ({
    id: a._id || `ACT-${String(i + 1).padStart(3, '0')}`,
    action: a.actionTitle,
    assignedTo: a.assignedTo,
    dueDate: a.dueDate,
    status: mapActionStatus(a.status),
    priority: a.priority,
    description: a.description,
    createdAt: a.createdAt,
    createdBy: a.createdBy,
  }));

  // Debug: Log attachments format
  console.log('📎 Raw attachments from API:', apiReport.attachments);

  const attachments: string[] = (apiReport.attachments || []).map((attachment: any) => {
    let url = '';

    // Handle different attachment formats
    if (typeof attachment === 'string') {
      // Already a string URL
      url = attachment;
    } else if (typeof attachment === 'object' && attachment !== null) {
      // Backend sends objects with metadata
      if (attachment.url) {
        url = attachment.url;
      } else if (attachment.path) {
        url = attachment.path;
      } else if (attachment.data) {
        url = attachment.data;
      }
    }

    // Normalize path separators (convert backslashes to forward slashes)
    url = url.replace(/\\/g, '/');

    // If URL is relative, prepend the API base URL
    if (url && !url.startsWith('http')) {
      // Remove leading slash to avoid double slashes
      const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
      url = `${apiBaseUrl}/${cleanUrl}`;
    }

    return url;
  }).filter(Boolean);

  console.log('📎 Processed attachments with full URLs:', attachments);

  const commentsFromList = (apiReport.comments || []).map((c, i) => {
    const firstName = c.commentedBy?.firstName || '';
    const lastName = c.commentedBy?.lastName || '';
    const author = c.author || `${firstName} ${lastName}`.trim() || c.commentedBy?.email || 'User';
    const backendRole = (c.role || c.commentedBy?.role || '').toLowerCase();
    const role: Comment['role'] = backendRole === 'supervisor'
      ? 'Supervisor'
      : backendRole === 'admin'
      ? 'Admin'
      : backendRole === 'field_user' || backendRole === 'field user' || backendRole === 'fielduser'
      ? 'Field User'
      : 'Admin';
    const rawTime = c.createdAt || c.commentedAt;
    return {
      id: c._id || `CMT-${String(i + 1).padStart(3, '0')}`,
      author,
      role,
      text: c.text,
      timestamp: rawTime ? formatDate(rawTime) : '',
      rawTime,
    };
  });

  const mapInlineComment = (inline: ApiInlineComment | undefined, roleFallback: 'Admin' | 'Supervisor', index: number) => {
    if (!inline || !inline.text) return null;
    const firstName = inline.commentedBy?.firstName || '';
    const lastName = inline.commentedBy?.lastName || '';
    const author = `${firstName} ${lastName}`.trim() || inline.commentedBy?.email || roleFallback;
    const backendRole = (inline.commentedBy?.role || inline.role || '').toLowerCase();
    const roleFromBackend = backendRole === 'supervisor' ? 'Supervisor' : backendRole === 'admin' ? 'Admin' : undefined;
    const role: Comment['role'] = inline.role === 'Supervisor' || inline.role === 'Admin'
      ? inline.role
      : roleFromBackend || roleFallback;
    const rawTime = inline.commentedAt || apiReport.createdAt;
    return {
      id: inline._id || `CMT-INLINE-${roleFallback}-${index}`,
      author,
      role,
      text: inline.text,
      timestamp: rawTime ? formatDate(rawTime) : '',
      rawTime,
    };
  };

  const adminInlineList = Array.isArray(apiReport.adminComment)
    ? apiReport.adminComment
    : apiReport.adminComment
    ? [apiReport.adminComment]
    : [];
  const supervisorInlineList = Array.isArray(apiReport.supervisorComment)
    ? apiReport.supervisorComment
    : apiReport.supervisorComment
    ? [apiReport.supervisorComment]
    : [];

  const inlineComments = [
    ...adminInlineList.map((comment, index) => mapInlineComment(comment, 'Admin', index + 1)),
    ...supervisorInlineList.map((comment, index) => mapInlineComment(comment, 'Supervisor', index + 1)),
  ].filter(Boolean) as Array<{
    id: string;
    author: string;
    role: 'Admin' | 'Supervisor';
    text: string;
    timestamp: string;
    rawTime: string;
  }>;

  const comments = [...commentsFromList, ...inlineComments]
    .sort((a, b) => Date.parse(b.rawTime || '') - Date.parse(a.rawTime || ''))
    .map(({ rawTime, ...comment }) => comment);

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
    rawCreatedAt: apiReport.createdAt,
    reportedBy: apiReport.reportedBy?.userId?.email || 'Unknown',
    equipmentInvolved: apiReport.equipmentInvolved || 'None',
    attachments,
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
    await api.patch(`/api/reports/${reportId}/status`, { status: 'completed' });
  },

  async addComment(reportId: string, text: string, role: string): Promise<void> {
    await api.patch(`/api/reports/${reportId}/comment`, { comment: text, role });
  },

  async deleteComment(reportId: string, commentId: string): Promise<void> {
    await api.delete(`/api/reports/${reportId}/comment/${commentId}`);
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
