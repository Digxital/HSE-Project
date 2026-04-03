import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ActionDetailsModal } from '@/components/actions/ActionDetailsModal';
import { useReports, type Action as ReportAction } from '@/services/ReportsContext';

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
  const { reports, loading, error, refreshReports } = useReports();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ActionFilterType>('All Actions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<any>(null);

  // Re-fetch reports every time the page is visited
  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  // Aggregate all actions from all reports
  const allActions = useMemo(() => {
    try {
      const aggregated: Action[] = [];
      reports.forEach((report) => {
        report.actions.forEach((action) => {
          aggregated.push({
            ...action,
            relatedReport: report.id,
            priority: 'Medium' as PriorityLevel,
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

  const getPriorityBadge = (priority: PriorityLevel) => {
    const styles = {
      High: 'bg-red-500 text-white',
      Medium: 'bg-orange-500 text-white',
      Low: 'bg-green-500 text-white',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status: ActionStatus) => {
    const styles = {
      'In Progress': 'bg-orange-100 text-orange-700',
      Open: 'bg-red-100 text-red-700',
      Completed: 'bg-green-100 text-green-700',
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
      'Suggested': 'bg-blue-100 text-blue-700',
      'User-Created': 'bg-purple-100 text-purple-700',
    };

    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
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
          userName={role === 'supervisor' ? 'John Matthew' : 'Peter Omorogbolahan'}
          userRole={role === 'supervisor' ? 'Supervisor' : 'Admin'}
          notificationCount={4}
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="mb-6" data-aos="fade-down">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Actions</h1>
            </div>

            {/* Actions Container */}
            <div className="bg-[#FFFAF5] rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6" data-aos="fade-up">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  Suggested and user-created corrective actions
                </h2>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          ? 'bg-orange-50 text-[#C24438] border border-[#C24438]'
                          : 'bg-[#FFF9F5] text-gray-600 hover:bg-[#FFFEFB]'
                      }`}
                    >
                      {filter.label}{' '}
                      <span
                        className={`ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-xs ${
                          selectedFilter === filter.label ? 'bg-[#C24438] text-white' : 'bg-gray-200 text-gray-600'
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm"
                  />
                </div>
                <button className="px-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg hover:bg-[#FFFEFB] transition-colors flex items-center gap-2 text-sm font-medium text-gray-700 justify-center whitespace-nowrap">
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
                    <tr className="bg-[#FFF9F5] border-b border-gray-200">
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">
                        Action ID
                      </th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">
                        Action Title
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
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
                            <p className="text-gray-500 text-sm">Loading actions...</p>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <p className="text-red-500 text-sm">{error}</p>
                        </td>
                      </tr>
                    ) : allActions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <p className="text-gray-500 text-sm">No actions found</p>
                        </td>
                      </tr>
                    ) : filteredActions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <p className="text-gray-500 text-sm">No actions match your filter</p>
                        </td>
                      </tr>
                    ) : (
                      filteredActions.map((action, index) => (
                        <tr
                          key={`${action.id}-${index}`}
                          onClick={() => {
                            // Create full action details for modal
                            setSelectedAction({
                              id: action.id,
                              title: action.action,
                              description: 'Corrective action details',
                              reportId: action.relatedReport,
                              assignedTo: action.assignedTo,
                              status: action.status,
                              createdOn: new Date().toLocaleDateString(),
                              dueDate: action.dueDate,
                              comments: 'Action from report system',
                              timeline: [
                                {
                                  date: `${new Date().toLocaleDateString()} - Action Created`,
                                  title: `Assigned to ${action.assignedTo}`,
                                  description: '',
                                },
                              ],
                            });
                          }}
                          className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors border-l-4 border-l-[#C24438] border-b border-b-gray-200 cursor-pointer"
                        >
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="font-medium text-gray-900 text-xs md:text-sm">{action.id}</div>
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="text-gray-900 text-xs md:text-sm">{action.action}</div>
                          </td>
                          <td className="hidden md:table-cell py-4 px-4">
                            {getTypeBadge(action.type)}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="text-gray-600 text-xs md:text-sm">{action.relatedReport}</div>
                          </td>
                          <td className="hidden md:table-cell py-4 px-4">
                            <div className="text-gray-600 text-sm">{action.assignedTo}</div>
                          </td>
                          <td className="hidden md:table-cell py-4 px-4">{getPriorityBadge(action.priority)}</td>
                          <td className="hidden md:table-cell py-4 px-4">
                            <div className="text-gray-600 text-sm">{action.dueDate}</div>
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
          console.log('Mark as completed:', actionId);
          // Update action status logic here
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
