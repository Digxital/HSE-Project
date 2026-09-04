import React, { useEffect, useMemo, useState } from 'react';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { DemoRequestDetailModal } from '@/components/superadmin/DemoRequestDetailModal';
import { useToast } from '@/hooks/useToast';
import { demoRequestService, type DemoRequest } from '@/services/demoRequestService';
import { getSuperAdminUserData } from '@/utils/authStorage';

export const SuperAdminDemoRequestsPage: React.FC = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const userData = getSuperAdminUserData();
  const displayName = userData?.name || 'Super Admin';
  const displayRole = userData?.role || 'Super Admin';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadRequests = async () => {
    try {
      setError(null);
      const data = await demoRequestService.fetchDemoRequests();
      // Newest first — matches how the organization list and notifications read.
      setRequests([...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load demo requests';
      setError(message);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadRequests().finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadRequests();
    } catch {
      showToast({ type: 'error', message: 'Failed to refresh demo requests' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return requests;
    return requests.filter((request) => {
      const fullName = `${request.firstName} ${request.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        request.company.toLowerCase().includes(query) ||
        request.email.toLowerCase().includes(query)
      );
    });
  }, [requests, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFFAF5] dark:bg-[#0D0D0D] transition-colors">
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      <SuperAdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className={`transition-all duration-300 ${isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <TopBar
          pageTitle="Demo Requests"
          userName={displayName}
          userRole={displayRole}
          syncStatus="synced"
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          showMenuButton={isMobile}
        />

        <div className="p-4 md:p-6 lg:p-8 bg-[#FFFAF5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Demo Requests</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Submissions from the "Request a Demo" form on the landing page.
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3 w-full xl:w-auto mb-6">
            <div className="relative flex-1 lg:w-72">
              <input
                type="text"
                placeholder="Search by name, company, or email.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] transition-colors"
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center w-9 h-9 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#121212] text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Refresh demo requests"
            >
              <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Table */}
          <div className="bg-[#FFFAF5] dark:bg-[#121212] rounded-xl overflow-hidden mt-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-4 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">Error: {error}</p>
                <button onClick={handleRefresh} className="mt-2 text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-medium">
                  Try Again
                </button>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <svg className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C2410C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity={0.2} />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">Loading demo requests...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-[#FFF4E64D] dark:bg-gray-800/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-center tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredRequests.map((request) => (
                      <tr
                        key={request._id}
                        onClick={() => setSelectedRequest(request)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-l-2 border-l-[#C2410C] cursor-pointer"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.firstName} {request.lastName}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{request.company}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{request.email}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{request.phone}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(request.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-[#C24438] dark:text-orange-500">
                            View →
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          {requests.length === 0 ? 'No demo requests yet.' : 'No demo requests match your search.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <DemoRequestDetailModal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  );
};
