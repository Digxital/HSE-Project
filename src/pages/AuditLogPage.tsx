import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'LOGOUT' | 'ARCHIVE';
  resourceType: string;
  resourceId: string;
  resourceName: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILURE';
}

interface AuditLogPageProps {
  role?: 'admin' | 'supervisor';
}

export const AuditLogPage: React.FC<AuditLogPageProps> = ({ role = 'admin' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 10;

  // Mock data for audit logs - simplified to match design
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '12 Feb, 10:45 AM',
      user: 'John Doe',
      userRole: 'Supervisor',
      action: 'Created Report',
      actionType: 'CREATE',
      resourceType: 'Reports',
      resourceId: 'RPT-2024-001',
      resourceName: 'Spill reported at Warehouse A',
      details: 'Oil Spill reported at Warehouse A',
      ipAddress: '192.168.1.105',
      status: 'SUCCESS',
    },
    {
      id: '2',
      timestamp: '12 Feb, 11:00 AM',
      user: 'Admin User',
      userRole: 'Admin',
      action: 'User Created',
      actionType: 'CREATE',
      resourceType: 'Users',
      resourceId: 'USR-2024-042',
      resourceName: 'Added new supervisor account',
      details: 'Added new supervisor account',
      ipAddress: '192.168.1.108',
      status: 'SUCCESS',
    },
    {
      id: '3',
      timestamp: '13 Feb, 02:15 PM',
      user: 'Sarah Lee',
      userRole: 'Supervisor',
      action: 'Action Completed',
      actionType: 'UPDATE',
      resourceType: 'Actions',
      resourceId: 'ACT-2024-015',
      resourceName: 'Uploaded completion proof',
      details: 'Uploaded completion proof',
      ipAddress: '192.168.1.102',
      status: 'SUCCESS',
    },
    {
      id: '4',
      timestamp: '13 Feb, 03:20 PM',
      user: 'System',
      userRole: 'System',
      action: 'Login Failed',
      actionType: 'LOGIN',
      resourceType: 'Authentication',
      resourceId: 'AUTH-2024-001',
      resourceName: 'Incorrect password attempt',
      details: 'Incorrect password attempt',
      ipAddress: '192.168.1.110',
      status: 'FAILURE',
    },
  ]);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'ALL' || log.userRole === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Get role counts
  const roleCount = (roleType: string) => {
    if (roleType === 'ALL') return auditLogs.length;
    return auditLogs.filter(log => log.userRole === roleType).length;
  };

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getActionTypeColor = (actionType: AuditLog['actionType']) => {
    switch (actionType) {
      case 'CREATE':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'UPDATE':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'DELETE':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'VIEW':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
      case 'EXPORT':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'LOGIN':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'LOGOUT':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'ARCHIVE':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors">
      {/* Backdrop for mobile sidebar */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

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
          pageTitle="Audit Log"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={isMobile}
          userName={role === 'supervisor' ? 'John Matthew' : 'Peter Omorogbolahan'}
          userRole={role === 'supervisor' ? 'Supervisor' : 'System Administrator'}
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Audit Log</h1>
              <p className="text-gray-600 dark:text-gray-400">Track all system activities.</p>
            </div>

            {/* Role Filter Pills & Search */}
            <div className="mb-6 space-y-4">
              {/* Role Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {(['ALL', 'Admin', 'Supervisor', 'Field User', 'HSE Officer'] as const).map((roleFilter) => (
                  <button
                    key={roleFilter}
                    onClick={() => {
                      setSelectedRole(roleFilter === 'ALL' ? 'ALL' : roleFilter);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedRole === (roleFilter === 'ALL' ? 'ALL' : roleFilter)
                        ? 'bg-[#C24438] dark:bg-orange-600 text-white'
                        : 'bg-white dark:bg-[#121212] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {roleFilter} {roleFilter !== 'ALL' && `(${roleCount(roleFilter)})`}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent transition-colors"
                />
                <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FFF9F5] dark:bg-[#0D0D0D] border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">Action</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">Module</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">Details</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {displayedLogs.length > 0 ? (
                      displayedLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-l-4 border-l-[#C24438] dark:border-l-orange-600">
                          <td className="px-4 md:px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{log.user}</td>
                          <td className="px-4 md:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{log.userRole}</td>
                          <td className="px-4 md:px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded text-xs font-medium ${getActionTypeColor(log.actionType)}`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-sm text-gray-900 dark:text-white">{log.resourceType}</td>
                          <td className="px-4 md:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{log.details}</td>
                          <td className="px-4 md:px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 md:px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">No audit logs found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === index + 1
                          ? 'bg-[#C24438] text-white'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
