import { createClient } from '@metagptx/web-sdk';

// Create and export the API client
export const client = createClient();

// Helper function to format dates
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to get status badge color
export const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    Open: 'bg-blue-500',
    'In Progress': 'bg-yellow-500',
    Resolved: 'bg-green-500',
    Closed: 'bg-gray-500',
    Completed: 'bg-green-500',
    Pending: 'bg-yellow-500',
    Approved: 'bg-green-500',
    Rejected: 'bg-red-500',
    'Under Investigation': 'bg-orange-500',
    Reported: 'bg-blue-500',
  };
  return statusColors[status] || 'bg-gray-500';
};

// Helper function to get severity badge color
export const getSeverityColor = (severity: string) => {
  const severityColors: Record<string, string> = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-orange-500',
    Critical: 'bg-red-500',
  };
  return severityColors[severity] || 'bg-gray-500';
};

// Helper function to get priority badge color
export const getPriorityColor = (priority: string) => {
  const priorityColors: Record<string, string> = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-orange-500',
    Critical: 'bg-red-500',
  };
  return priorityColors[priority] || 'bg-gray-500';
};

// Check if action is overdue
export const isOverdue = (dueDate: string, status: string) => {
  if (status === 'Completed' || status === 'Verified') return false;
  const due = new Date(dueDate);
  const now = new Date();
  return due < now;
};