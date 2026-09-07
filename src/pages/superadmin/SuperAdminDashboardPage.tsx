import React, { useEffect, useState } from 'react';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { OrganizationDetailsModal } from '@/components/superadmin/OrganizationDetailsModal';
import { useOrganizations } from '@/services/OrganizationContext';
import { getSuperAdminUserData } from '@/utils/authStorage';
import type { Organization } from '@/services/organizationService';

export const SuperAdminDashboardPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { organizations, loading, getOrganizationStats } = useOrganizations();

  // Get stats from context
  const stats = getOrganizationStats();

  const userData = getSuperAdminUserData();
  const displayName = userData?.name || 'Super Admin';
  const displayRole = userData?.role || 'Super Admin';

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Get first 3 latest organizations
  const recentOrganizations = organizations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleOrganizationClick = (org: Organization) => {
    setSelectedOrganization(org);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors">
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
      <div
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Bar */}
        <TopBar
          pageTitle="Dashboard"
          userName={displayName}
          userRole={displayRole}
          syncStatus="synced"
          onMenuClick={handleMobileSidebarToggle}
          showMenuButton={isMobile}
        />

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          {/* Management Overview */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mr-2">Management Overview</h2>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 text-gray-500 text-xs">i</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Organizations', value: stats.total, icon: '🏢', color: 'text-blue-500' },
                { label: 'Active Organizations', value: stats.active, icon: '✅', color: 'text-green-500' },
                { label: 'Pending Organizations', value: stats.pending, icon: '⏳', color: 'text-yellow-600' },
                { label: 'Inactive/Suspended', value: stats.suspended, icon: '🚫', color: 'text-red-500' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-800 dark:text-gray-300 text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                  <div className="mb-2">
                    {loading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {stat.value}
                      </h3>
                    )}
                  </div>
                  <p className={`text-xs ${stat.color}`}>
                    {idx === 0 && <span className="inline-block mr-1">↑</span>}
                    {idx === 1 && <span className="inline-block w-2 h-2 rounded-full mr-1 opacity-70 bg-green-500" />}
                    {idx === 2 && <span className="inline-block w-4 h-4 mr-1 text-yellow-600 -ml-1 text-lg leading-none align-middle">◷</span>}
                    {idx === 3 && <span className="inline-block w-3 h-3 mr-1 rounded-full border border-red-500 text-red-500 text-center leading-none text-[8px] align-middle">/</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Organizations */}
          {organizations.length > 0 && !loading && (
            <div className="mt-8">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mr-2">Recent Organizations</h2>
              </div>

              <div className="bg-white dark:bg-[#121212] rounded-xl overflow-hidden">
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
                      {recentOrganizations.map((org) => (
                        <tr
                          key={org._id}
                          onClick={() => handleOrganizationClick(org)}
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
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{org.contactEmail}</span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(org.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center mx-auto bg-white dark:bg-gray-800 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Organization Details Modal */}
          <OrganizationDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            organization={selectedOrganization}
          />

          {/* Empty State - Only show if no organizations and not loading */}
          {organizations.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center mt-32 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 relative">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0D0D0D] rounded-full p-0.5">
                  <span className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold font-sans">+</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#200500] dark:text-white mb-2">No Organizations Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Create your first organization to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
