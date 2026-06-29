import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ActionDetailsModal } from '@/components/actions/ActionDetailsModal';
import { useReports, type Action as ReportAction } from '@/services/ReportsContext';
import { getUserData } from '@/utils/authStorage';

type ActionFilterType = 'All Actions' | 'Open' | 'In Progress' | 'Completed' | 'Overdue';
type ActionStatus = 'Open' | 'In Progress' | 'Completed';
type PriorityLevel = 'High' | 'Medium' | 'Low';

interface Action extends ReportAction {
  relatedReport: string;
  priority: PriorityLevel;
}

interface ActionsPageProps {
  role?: 'admin' | 'supervisor';
}

export const ActionsPage: React.FC<ActionsPageProps> = ({ role = 'admin' }) => {
  const userData = getUserData();
  const { reports, loading, error, refreshReports, updateActionStatus } = useReports();
  const [searchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ActionFilterType>('All Actions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<any>(null);

  const displayName = userData?.name || 'User';
  const displayRole = userData?.role
    ? userData.role === 'supervisor'
      ? 'Supervisor'
      : 'System Administrator'
    : role === 'supervisor'
      ? 'Supervisor'
      : 'System Administrator';

  const formatActionId = (id: string) => {
    const trimmed = id.trim();
    if (/^[a-f0-9]{24}$/i.test(trimmed)) {
      return `ACT-${trimmed.slice(-6).toUpperCase()}`;
    }
    return trimmed;
  };

  const formatDueDate = (dateValue: string) => {
    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    }
    return dateValue;
  };

  // Re-fetch reports when the page is visited (only if data is stale or missing)
  useEffect(() => {
    if (reports.length === 0 && !loading) {
      refreshReports();
    }
  }, []);

  // Aggregate all actions from all reports
  const allActions = useMemo(() => {
    try {
      const aggregated: Action[] = [];
      reports.forEach((report) => {
        report.actions.forEach((action) => {
          aggregated.push({
            ...action,
            relatedReport: report.id,
            priority: (action.priority as PriorityLevel) || 'Medium',
          });
        });
      });
      
      const completedCount = aggregated.filter(a => a.status === 'Completed').length;
      console.log(`📊 Actions aggregated: ${aggregated.length} total actions from ${reports.length} reports`);
      console.log(`✅ Completed actions: ${completedCount}`);
      console.log(`📋 Breakdown - Open: ${aggregated.filter(a => a.status === 'Open').length}, In Progress: ${aggregated.filter(a => a.status === 'In Progress').length}, Completed: ${completedCount}`);
      
      return aggregated;
    } catch (err) {
      console.error('Error aggregating actions:', err);
      return [];
    }
  }, [reports]);

  // Calculate if action is overdue
  const isOverdue = (dueDate: string, status: ActionStatus): boolean => {
    if (status === 'Completed') return false;
    try {
      const today = new Date();
      const due = new Date(dueDate);
      return due < today && !isNaN(due.getTime());
    } catch {
      return false;
    }
  };

  const filters: { label: ActionFilterType; count: number }[] = [
    { label: 'All Actions', count: allActions.length },
    { label: 'Open', count: allActions.filter((a) => a.status === 'Open').length },
    { label: 'In Progress', count: allActions.filter((a) => a.status === 'In Progress').length },
    { label: 'Completed', count: allActions.filter((a) => a.status === 'Completed').length },
    { label: 'Overdue', count: allActions.filter((a) => isOverdue(a.dueDate, a.status as ActionStatus)).length },
  ];

  const filteredActions = allActions.filter((action) => {
    const matchesFilter =
      selectedFilter === 'All Actions' ||
      (selectedFilter === 'Overdue' && isOverdue(action.dueDate, action.status as ActionStatus)) ||
      (selectedFilter !== 'Overdue' && action.status === selectedFilter);

    const matchesSearch =
      searchQuery === '' ||
      action.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.relatedReport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.status.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const buildActionDetails = (action: Action) => {
    // Find the related report to get attachments
    const relatedReport = reports.find(r => r.id === action.relatedReport);
    
    return {
      id: action.id,
      title: action.action,
      description: action.description || 'Corrective action details',
      reportId: action.relatedReport,
      assignedTo: action.assignedTo,
      status: action.status,
      createdOn: action.createdAt ? new Date(action.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      dueDate: formatDueDate(action.dueDate),
      comments: 'Action from report system',
      attachments: relatedReport?.attachments || [],
      timeline: [
        {
          date: `${new Date().toLocaleDateString()} - Action Created`,
          title: `Assigned to ${action.assignedTo}`,
          description: '',
        },
      ],
    };
  };

  useEffect(() => {
    const actionId = searchParams.get('actionId');
    if (!actionId) return;
    const found = allActions.find((action) => action.id === actionId);
    if (found) {
      setSelectedAction(buildActionDetails(found));
    }
  }, [allActions, searchParams]);

  const getPriorityBadge = (priority: PriorityLevel) => {
    const styles = {
      High: 'bg-red-500 dark:bg-red-900/30 text-white dark:text-red-400',
      Medium: 'bg-orange-500 dark:bg-orange-900/30 text-white dark:text-orange-400',
      Low: 'bg-green-500 dark:bg-green-900/30 text-white dark:text-green-400',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status: ActionStatus) => {
    const styles = {
      'In Progress': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      Open: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      Completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const styles = {
      'Suggested': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'User-Created': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    };

    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${styles[type as keyof typeof styles] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        role={role}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Bar */}
        <TopBar 
          pageTitle="Actions"
          userName={displayName}
          userRole={displayRole}
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="mb-6" data-aos="fade-down">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Actions</h1>
            </div>

            {/* Actions Container */}
            <div className="bg-[#fffaf5] dark:bg-[#121212] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-colors" data-aos="fade-up">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  Suggested and user-created corrective actions
                </h2>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>

              {/* Filter Tabs - Scrollable on mobile */}
              <div className="mb-6 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0" data-aos="fade-up">
                <div className="flex gap-2 md:gap-3 min-w-max md:min-w-0">
                  {filters.map((filter) => (
                    <button
                      key={filter.label}
                      onClick={() => setSelectedFilter(filter.label)}
                      className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                        selectedFilter === filter.label
                          ? 'bg-orange-50 dark:bg-orange-900/30 text-[#C24438] dark:text-orange-400 border border-[#C24438] dark:border-orange-600'
                          : 'bg-[#FFF9F5] dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#FFFEFB] dark:hover:bg-gray-700 transition-colors'
                      }`}
                    >
                      {filter.label}{' '}
                      <span
                        className={`ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-xs ${
                          selectedFilter === filter.label ? 'bg-[#C24438] dark:bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-row gap-3 mb-6" data-aos="fade-up" data-aos-delay="100">
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500\"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Action ID, Report Title, Assigned..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F5] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] dark:focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400 dark:placeholder-gray-500 transition-colors\"
                  />
                </div>
                <button className="px-4 py-2.5 bg-[#FFF9F5] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-[#FFFEFB] dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium justify-center whitespace-nowrap">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span>Filter</span>
                </button>
              </div>

              {/* Actions Table */}
              <div className="overflow-x-auto -mx-3 md:mx-0" data-aos="fade-up" data-aos-delay="150">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#FFF9F5] dark:bg-[#0D0D0D] border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Action ID
                      </th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">
                        Action Title
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Type
                      </th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">
                        Related Report
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Assigned To
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Priority
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Due Date
                      </th>
                      <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-[#C24438] border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading actions...</p>
                          </div>
                        </td>
                      </tr>
                    ) : error && allActions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
                        </td>
                      </tr>
                    ) : allActions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No actions found</p>
                        </td>
                      </tr>
                    ) : filteredActions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No actions match your filter</p>
                        </td>
                      </tr>
                    ) : (
                      filteredActions.map((action, index) => (
                        <tr
                          key={`${action.id}-${index}`}
                          onClick={() => {
                            setSelectedAction(buildActionDetails(action));
                          }}
                          className="bg-[#FFFAF5] dark:bg-[#121212] hover:bg-[#FFFEFB] dark:hover:bg-gray-800 transition-colors border-l-4 border-l-[#C24438] dark:border-l-orange-500 border-b border-b-gray-200 dark:border-b-gray-700 cursor-pointer"
                        >
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="font-medium text-gray-900 dark:text-white text-xs md:text-sm">{formatActionId(action.id)}</div>
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4\">
                            <div className="text-gray-900 dark:text-gray-100 text-xs md:text-sm">{action.action}</div>
                          </td>
                          <td className="hidden md:table-cell py-4 px-4">
                            {getTypeBadge(action.type)}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">{action.relatedReport}</div>
                          </td>
                          <td className="hidden md:table-cell py-4 px-4\">
                            <div className="text-gray-600 dark:text-gray-300 text-sm">{action.assignedTo}</div>
                          </td>
                          <td className="hidden md:table-cell py-4 px-4">{getPriorityBadge(action.priority)}</td>
                          <td className="hidden md:table-cell py-4 px-4">
                            <div className="text-gray-600 dark:text-gray-300 text-sm">{formatDueDate(action.dueDate)}</div>
                          </td>
                          <td className="hidden lg:table-cell py-4 px-4">{getStatusBadge(action.status as ActionStatus)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Action Details Modal */}
      <ActionDetailsModal
        isOpen={selectedAction !== null}
        onClose={() => setSelectedAction(null)}
        action={selectedAction}
        onMarkCompleted={(actionId) => {
          if (selectedAction?.reportId) {
            updateActionStatus(selectedAction.reportId, actionId, 'Completed');
          }
          setSelectedAction(null);
        }}
        onVerifyClose={(actionId) => {
          console.log('Verify and close:', actionId);
          // Update action status logic here
          setSelectedAction(null);
        }}
        onReopen={(actionId) => {
          console.log('Reopen action:', actionId);
          // Update action status logic here
          setSelectedAction(null);
        }}
      />
    </div>
  );
};
