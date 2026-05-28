import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import api from '@/lib/axios';
import { getAuthToken, getUserData } from '@/utils/authStorage';

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
  const navigate = useNavigate();
  const userData = getUserData();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  const displayName = userData?.name || 'User';
  const displayRole = userData?.role
    ? userData.role === 'supervisor'
      ? 'Supervisor'
      : 'System Administrator'
    : role === 'supervisor'
      ? 'Supervisor'
      : 'System Administrator';
  const normalizeText = (value: unknown, fallback = '') => {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return fallback;
    return String(value);
  };
  const getUserDisplay = (log: any) => {
    const emailCandidate =
      log.userEmail ||
      log.email ||
      log.user?.email ||
      log.user?.userEmail ||
      log.actor?.email;
    if (emailCandidate) return emailCandidate;

    const idCandidate =
      log.userId ||
      log.user?.id ||
      log.user?._id ||
      log.user?.userId ||
      log.actorId ||
      log.actor?.id ||
      log.actor?._id;
    if (idCandidate) return idCandidate;

    return log.user || log.userName;
  };

  // Check authentication
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      console.warn('⚠️ No authentication token found. Redirecting to login...');
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch audit logs from backend
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = selectedAction === 'ALL' ? undefined : { action: selectedAction };
        console.log('🔍 Fetching audit logs from backend...', params ? params : 'all');
        const response = await api.get('/api/auditlogs', params ? { params } : undefined);
        
        console.log('✅ Backend response:', response.data);
        
        // Check if backend returned success:false
        if (response.data.success === false) {
          console.error('❌ Backend error:', response.data.message);
          setError(`Backend error: ${response.data.message}`);
          setAuditLogs([]);
          return;
        }
        
        const extractLogsArray = (payload: any): any[] | null => {
          if (Array.isArray(payload)) return payload;
          if (!payload || typeof payload !== 'object') return null;

          const directCandidates = [
            payload.data,
            payload.auditlogs,
            payload.auditLogs,
            payload.logs,
            payload.results,
            payload.items,
            payload.records,
          ];

          for (const candidate of directCandidates) {
            if (Array.isArray(candidate)) return candidate;
            if (candidate && typeof candidate === 'object') {
              const nestedCandidates = [
                candidate.data,
                candidate.auditlogs,
                candidate.auditLogs,
                candidate.logs,
                candidate.results,
                candidate.items,
                candidate.records,
              ];
              for (const nested of nestedCandidates) {
                if (Array.isArray(nested)) return nested;
              }
            }
          }

          return null;
        };

        const logsData = extractLogsArray(response.data);

        if (!logsData) {
          console.warn('⚠️ Unexpected response format:', logsData);
          setError(`Unexpected response format from backend - ${response.statusText}`);
          setAuditLogs([]);
          return;
        }
        
        console.log('✅ Audit logs fetched:', logsData);
        
        // Transform backend data to match our interface
        const transformedLogs = logsData.map((log: any) => ({
          id: log.id || log._id || `${log.actionType || 'log'}-${Math.random()}`,
          timestamp: normalizeText(log.timestamp, new Date().toLocaleString()),
          user: normalizeText(getUserDisplay(log), 'Unknown'),
          userRole: normalizeText(log.userRole || log.role, 'User'),
          action: normalizeText(log.action || log.actionType, 'Unknown Action'),
          actionType: (log.actionType as AuditLog['actionType']) || 'VIEW',
          resourceType: normalizeText(log.resourceType, 'Unknown'),
          resourceId: normalizeText(log.resourceId, ''),
          resourceName: normalizeText(log.resourceName || log.description, ''),
          details: normalizeText(log.details || log.description, ''),
          ipAddress: normalizeText(log.ipAddress, 'N/A'),
          status: (log.status as AuditLog['status']) || 'SUCCESS',
        }));
        
        setAuditLogs(transformedLogs);
      } catch (err: any) {
        console.error('❌ Error fetching audit logs:', err);
        
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again to view audit logs.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view audit logs.');
        } else if (err.response?.status === 404) {
          setError('Audit logs endpoint not found on backend.');
        } else {
          setError(err.response?.data?.message || 'Failed to load audit logs. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [selectedAction]);

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
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      normalizeText(log.user).toLowerCase().includes(query) ||
      normalizeText(log.action).toLowerCase().includes(query) ||
      normalizeText(log.resourceName).toLowerCase().includes(query) ||
      normalizeText(log.details).toLowerCase().includes(query);
    
      return matchesSearch;
  });

  const actionFilters = [
    'ALL',
    'USER_CREATED',
    'USER_UPDATED',
    'ROLE_CHANGED',
    'RECORD_DELETED',
    'LOGIN_FAILED',
    'CERTIFICATION_UPLOADED',
  ] as const;


  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  const startResult = filteredLogs.length === 0 ? 0 : startIndex + 1;
  const endResult = Math.min(startIndex + itemsPerPage, filteredLogs.length);

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
          userName={displayName}
          userRole={displayRole}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Audit Log</h1>
              <p className="text-gray-600 dark:text-gray-400">Track all system activities.</p>
            </div>

            {/* Action Filter & Search */}
            <div className="mb-6 space-y-4">
              {/* Action Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {actionFilters.map((actionFilter) => (
                  <button
                    key={actionFilter}
                    onClick={() => {
                      setSelectedAction(actionFilter);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedAction === actionFilter
                        ? 'bg-[#C24438] dark:bg-orange-600 text-white'
                        : 'bg-white dark:bg-[#121212] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {actionFilter === 'ALL' ? 'All Actions' : actionFilter.replace(/_/g, ' ')}
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
                  className="w-full px-4 py-2.5 bg-[#FFF9F5] dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent transition-colors"
                />
                <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Error State */}
            {error && !loading && auditLogs.length === 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="bg-[#FFFAF5] dark:bg-[#121212] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <svg className="w-8 h-8 text-[#C24438] dark:text-orange-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Loading audit logs...</p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing {startResult} to {endResult} of {filteredLogs.length} results
                </div>

            {/* Audit Logs Table */}
            <div className="bg-[#FFFAF5] dark:bg-[#121212] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                        <tr key={log.id} className="hover:bg-[#FFFEFB] dark:hover:bg-gray-800/50 transition-colors border-l-4 border-l-[#C24438] dark:border-l-orange-600">
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
              <div className="mt-6 flex items-center justify-between px-4 py-3 bg-[#FFFAF5] dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-[#FFF9F5] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-[#FFFEFB] dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          : 'text-gray-700 dark:text-gray-300 bg-[#FFF9F5] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-[#FFFEFB] dark:hover:bg-gray-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-[#FFF9F5] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-[#FFFEFB] dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
