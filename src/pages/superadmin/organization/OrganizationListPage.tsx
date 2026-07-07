import React, { useEffect, useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { CreateOrganizationFlow } from '@/components/superadmin/CreateOrganizationFlow';
import { OrganizationDetailsModal } from '@/components/superadmin/OrganizationDetailsModal';
import { useToast } from '@/hooks/useToast';
import { useOrganizations } from '@/services/OrganizationContext';
import { getSuperAdminUserData } from '@/utils/authStorage';

// Error boundary to prevent context errors from crashing the entire page
class OrganizationPageErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFAF5] dark:bg-[#0D0D0D] flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Something went wrong loading this page.</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="px-4 py-2 bg-[#C2410C] text-white rounded-lg text-sm font-medium hover:bg-[#a83409]"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type OrganizationStatus = 'All' | 'Active' | 'Pending' | 'Suspended';

interface Organization {
  _id: string;
  organizationName: string;
  organizationId: string;
  primaryContactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  organizationAddress: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  logo?: { url: string };
}

export const SuperAdminOrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { organizations, loading: contextLoading, error: contextError, refreshOrganizations } = useOrganizations();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrganizationStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userData = getSuperAdminUserData();
  const displayName = userData?.name || 'Super Admin';
  const displayRole = userData?.role || 'Super Admin';

  // Close modal when organization is deleted
  useEffect(() => {
    const handleOrganizationDeleted = () => {
      setIsDetailsModalOpen(false);
    };

    window.addEventListener('organizationDeleted', handleOrganizationDeleted);
    return () => window.removeEventListener('organizationDeleted', handleOrganizationDeleted);
  }, []);

  // Check mobile responsiveness
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-redirect to login if session expired
  useEffect(() => {
    if (contextError === 'session_expired') {
      // Wait briefly to show the error, then redirect
      const timer = setTimeout(() => {
        navigate('/superadmin/login', { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [contextError, navigate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshOrganizations();
      showToast({ type: 'success', message: 'Organizations refreshed successfully' });
    } catch (error) {
      showToast({ type: 'error', message: 'Failed to refresh organizations' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMobileSidebarToggle = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const handleOrganizationRowClick = (org: Organization) => {
    setSelectedOrganization(org);
    setIsDetailsModalOpen(true);
  };

  // Derive counts for tabs
  const allCount = organizations.length;
  const activeCount = organizations.filter(o => o.status === 'ACTIVE').length;
  const pendingCount = organizations.filter(o => o.status === 'PENDING').length;
  const suspendedCount = organizations.filter(o => o.status === 'SUSPENDED' || o.status === 'INACTIVE').length;

  // Convert tab status to API status
  const getApiStatus = (tabStatus: OrganizationStatus): string | null => {
    switch (tabStatus) {
      case 'Active':
        return 'ACTIVE';
      case 'Pending':
        return 'PENDING';
      case 'Suspended':
        return 'SUSPENDED';
      default:
        return null;
    }
  };

  // Filtering based on status and search query
  let filteredOrgs = organizations;
  if (selectedStatus !== 'All') {
    const apiStatus = getApiStatus(selectedStatus);
    if (apiStatus) {
      filteredOrgs = filteredOrgs.filter(org => org.status === apiStatus);
    }
  }
  if (searchQuery.trim()) {
    filteredOrgs = filteredOrgs.filter(org => org.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] dark:bg-[#0D0D0D] transition-colors">
      {/* Backdrop for mobile sidebar */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <SuperAdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Organization Management"
          userName={displayName}
          userRole={displayRole}
          syncStatus="synced"
          onMenuClick={handleMobileSidebarToggle}
          showMenuButton={isMobile}
        />

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8 bg-[#FFFAF5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mr-2">Management Overview</h2>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 text-[10px]">i</span>
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#C2410C] hover:bg-[#a83409] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Create New Organization
            </button>
          </div>

          {/* Filters & Tabs */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
            
            {/* Tabs */}
            <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto custom-scrollbar pb-[1px]">
              {(['All', 'Active', 'Pending', 'Suspended'] as OrganizationStatus[]).map((status) => {
                const isSelected = selectedStatus === status;
                const count = status === 'All' ? allCount : status === 'Active' ? activeCount : status === 'Pending' ? pendingCount : suspendedCount;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      isSelected 
                        ? 'border-[#C2410C] text-[#C2410C]' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {status} 
                    <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-3 w-full xl:w-auto">
              <div className="relative flex-1 lg:w-72">
                <input
                  type="text"
                  placeholder="Search by tenant name.."
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
                title="Refresh organizations"
              >
                <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              </button>

              <button className="flex items-center justify-center w-9 h-9 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#121212] text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-[#FFFAF5] dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#FFFAF5] dark:bg-[#121212] rounded-xl overflow-hidden mt-4">
            {contextError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-4 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">Error: {contextError}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}
            {contextLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <svg className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C2410C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity={0.2} />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">Loading organizations...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-[#FFF4E64D] dark:bg-gray-800/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-center tracking-wider">Action</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredOrgs.map((org) => (
                    <tr 
                      key={org._id} 
                      onClick={() => handleOrganizationRowClick(org)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-l-2 border-l-[#C2410C] cursor-pointer"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{org.organizationName}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                          org.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                          org.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30' :
                          'bg-red-50 text-red-500 dark:bg-red-900/30'
                        }`}>
                          {org.status === 'ACTIVE' ? 'Active' : org.status === 'PENDING' ? 'Pending' : org.status === 'INACTIVE' ? 'Inactive' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{org.contactEmail || '—'}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(org.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center mx-auto bg-white dark:bg-gray-800 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrgs.length === 0 && !contextLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        No organizations found matching the criteria.
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

      {/* Create Organization Modal with Flow */}
      <CreateOrganizationFlow
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrganizationCreated={() => {
          // Context will auto-refresh via the organizationUpdated event
          setIsCreateModalOpen(false);
        }}
      />

      {/* Organization Details Modal */}
      <OrganizationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        organization={selectedOrganization}
      />
    </div>
  );
};

// Wrap with error boundary so context/HMR issues never crash the whole app
export default function SuperAdminOrganizationPageWithBoundary() {
  return (
    <OrganizationPageErrorBoundary>
      <SuperAdminOrganizationPage />
    </OrganizationPageErrorBoundary>
  );
}
