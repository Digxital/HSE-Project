import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ReportDetailsModal } from '@/components/reports/ReportDetailsModal';
import { useReports, type Report, type RiskLevel, type ReportStatus } from '@/services/ReportsContext';

type ReportType = 'All' | 'Incidents' | 'Hazard';

interface ReportsPageProps {
  role?: 'admin' | 'supervisor';
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ role = 'admin' }) => {
  const { reports, closeReport, addComment, addAction } = useReports();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);

  // Keep selectedReport in sync with context data
  useEffect(() => {
    if (selectedReport) {
      const updated = reports.find(r => r.id === selectedReport.id);
      if (updated) {
        setSelectedReport(updated);
      }
    }
  }, [reports]);

  const types: { label: ReportType; count: number }[] = [
    { label: 'All', count: reports.length },
    { label: 'Incidents', count: reports.filter((r) => r.type === 'Incident').length },
    { label: 'Hazard', count: reports.filter((r) => r.type === 'Hazard').length },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesType = 
      selectedType === 'All' || 
      (selectedType === 'Incidents' && report.type === 'Incident') ||
      (selectedType === 'Hazard' && report.type === 'Hazard');
    const matchesSearch =
      searchQuery === '' ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.risk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.status.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const handleCloseReport = (reportId: string) => {
    closeReport(reportId);
    setSelectedReport(null);
  };

  const handleAddComment = (reportId: string, text: string) => {
    addComment(reportId, text, role);
  };

  const handleAddAction = (
    reportId: string,
    actionData: {
      actionTitle: string;
      assignedTo: string;
      dueDate: string;
      priority: string;
      description: string;
    }
  ) => {
    addAction(reportId, actionData);
  };

  const getRiskBadge = (risk: RiskLevel) => {
    const styles = {
      High: 'bg-red-500 text-white',
      Medium: 'bg-orange-500 text-white',
      Low: 'bg-green-500 text-white',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[risk]}`}>
        {risk}
      </span>
    );
  };

  const getStatusText = (status: ReportStatus) => {
    const styles = {
      Open: 'text-[#FF3B30] font-medium',
      'In Progress': 'text-[#FF9500] font-medium',
      Closed: 'text-gray-500 font-medium',
    };

    return <span className={styles[status]}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        role={role}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Report"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
          userName={role === 'supervisor' ? 'John Matthew' : 'Peter Omorogbolahan'}
          userRole={role === 'supervisor' ? 'Supervisor' : 'System Administrator'}
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6" data-aos="fade-down">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-gray-900">Reports List</h1>
                <div 
                  className="relative"
                  onMouseEnter={() => setShowHeaderTooltip(true)}
                  onMouseLeave={() => setShowHeaderTooltip(false)}
                >
                  <button 
                    onClick={() => setShowHeaderTooltip(!showHeaderTooltip)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  
                  {/* Tooltip */}
                  {showHeaderTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                      View and manage all submitted reports
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-6" data-aos="fade-up" data-aos-delay="50">
              {types.map((type) => (
                <button
                  key={type.label}
                  onClick={() => setSelectedType(type.label)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                    selectedType === type.label
                      ? 'bg-orange-50 text-[#C24438] border border-[#C24438]'
                      : 'bg-[#FFF9F5] text-gray-600 hover:bg-[#FFFEFB]'
                  }`}
                >
                  {type.label}
                  <span
                    className={`ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-xs ${
                      selectedType === type.label
                        ? 'bg-[#C24438] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {type.count}
                  </span>
                </button>
              ))}
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
                  placeholder="Search by incident, hazard, Risk level, status..."
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
                Filter
              </button>
            </div>

            {/* Reports Table */}
            <div className="overflow-x-auto -mx-3 md:mx-0" data-aos="fade-up" data-aos-delay="150">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#FFF9F5] border-b border-gray-200">
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Report ID</th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500 hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Category</th>
                      <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Location
                      </th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Risk</th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Date Reported
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors border-l-4 border-l-[#C24438] border-b border-b-gray-200 cursor-pointer"
                      >
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="font-medium text-gray-900 text-xs md:text-sm">{report.id}</div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 hidden md:table-cell">
                          <div className="text-gray-900 text-sm">{report.type}</div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="text-gray-600 text-xs md:text-sm">{report.category}</div>
                        </td>
                        <td className="hidden lg:table-cell py-4 px-4">
                          <div className="text-gray-600 text-sm">{report.location}</div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4">{getRiskBadge(report.risk)}</td>
                        <td className="hidden md:table-cell py-4 px-4">{getStatusText(report.status)}</td>
                        <td className="hidden lg:table-cell py-4 px-4">
                          <div className="text-gray-600 text-sm whitespace-pre-line">{report.dateReported}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        </main>
      </div>

      {/* Report Details Modal */}
      <ReportDetailsModal
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        onCloseReport={handleCloseReport}
        onAddAction={handleAddAction}
        onAddComment={handleAddComment}
        report={selectedReport}
      />
    </div>
  );
};
