import React, { useEffect, useState } from 'react';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { CreateOrganizationFlow } from '@/components/superadmin/CreateOrganizationFlow';
import { OrganizationDetailsModal } from '@/components/superadmin/OrganizationDetailsModal';

type OrganizationStatus = 'All' | 'Active' | 'Pending' | 'Suspended';

interface Organization {
  id: string;
  name: string;
  status: 'Active' | 'Pending' | 'Suspended';
  subscriptionPlan: 'Enterprise' | 'Premium' | 'Basic' | 'Free';
  createdDate: string;
  tenantId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  image?: string;
  reportsSubmitted?: number;
  totalReports?: number;
  openActions?: number;
  activeCertifications?: number;
  primaryContactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  registeredAddress?: string;
  maximumUsers?: number;
  reportsStorageLimit?: string;
  dataRetentionPeriod?: string;
}

export const SuperAdminOrganizationPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrganizationStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Dummy Data matching user's image exactly
  const organizations: Organization[] = [
    {
      id: '1',
      name: 'Acme Manufacturing Ltd',
      status: 'Active',
      subscriptionPlan: 'Enterprise',
      createdDate: '12 Jul 2025',
      tenantId: 'TN - 500801',
      primaryColor: '#D05230',
      secondaryColor: '#5E7EB',
      reportsSubmitted: 145,
      totalReports: 632,
      openActions: 38,
      activeCertifications: 112,
      primaryContactName: 'John Smith',
      contactEmail: 'john.smith@acmemanufacturing.com',
      contactPhone: '+44 7700 900123',
      registeredAddress: '45 Industrial Park Road, Manchester, United Kingdom',
      maximumUsers: 600,
      reportsStorageLimit: '10,000 Reports',
      dataRetentionPeriod: '36 Months',
    },
    {
      id: '2',
      name: 'GreenField Logistics',
      status: 'Active',
      subscriptionPlan: 'Premium',
      createdDate: '08 Jul 2025',
    },
    {
      id: '3',
      name: 'BrightCare Healthcare',
      status: 'Pending',
      subscriptionPlan: 'Basic',
      createdDate: '05 Jul 2025',
      tenantId: 'TN - 500802',
      primaryColor: '#2563EB',
      secondaryColor: '#06B6D4',
      reportsSubmitted: 0,
      totalReports: 0,
      openActions: 0,
      activeCertifications: 0,
      primaryContactName: 'Sarah Johnson',
      contactEmail: 'sarah.johnson@brightcare.com',
      contactPhone: '+44 7700 900456',
      registeredAddress: '123 Healthcare Ave, London, United Kingdom',
      maximumUsers: 150,
      reportsStorageLimit: '5,000 Reports',
      dataRetentionPeriod: '12 Months',
    },
    {
      id: '4',
      name: 'BrightCare Healthcare',
      status: 'Suspended',
      subscriptionPlan: 'Free',
      createdDate: '27 May 2025',
      tenantId: 'TN - 500803',
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      reportsSubmitted: 89,
      totalReports: 450,
      openActions: 12,
      activeCertifications: 45,
      primaryContactName: 'Michael Brown',
      contactEmail: 'michael.brown@brightcare.com',
      contactPhone: '+44 7700 900789',
      registeredAddress: '456 Hospital Street, Glasgow, United Kingdom',
      maximumUsers: 50,
      reportsStorageLimit: '2,000 Reports',
      dataRetentionPeriod: '6 Months',
    },
  ];

  // Derive counts for tabs
  const allCount = organizations.length;
  const activeCount = organizations.filter(o => o.status === 'Active').length;
  const pendingCount = organizations.filter(o => o.status === 'Pending').length;
  const suspendedCount = organizations.filter(o => o.status === 'Suspended').length;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileSidebarToggle = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const handleOrganizationRowClick = (org: Organization) => {
    setSelectedOrganization(org);
    setIsDetailsModalOpen(true);
  };

  // Filtering based on status and search query
  let filteredOrgs = organizations;
  if (selectedStatus !== 'All') {
    filteredOrgs = filteredOrgs.filter(org => org.status === selectedStatus);
  }
  if (searchQuery.trim()) {
    filteredOrgs = filteredOrgs.filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
          userName="Peter Omogbolahan"
          userRole="Admin"
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
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-[#FFF4E64D] dark:bg-gray-800/50">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscription Plan</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-center tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredOrgs.map((org, idx) => (
                    <tr 
                      key={org.id} 
                      onClick={() => handleOrganizationRowClick(org)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-l-2 border-l-[#C2410C] cursor-pointer"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{org.name}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                          org.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                          org.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30' :
                          'bg-red-50 text-red-500 dark:bg-red-900/30'
                        }`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          org.subscriptionPlan === 'Enterprise' ? 'text-[#C2410C]' :
                          org.subscriptionPlan === 'Premium' ? 'text-yellow-500' :
                          org.subscriptionPlan === 'Basic' ? 'text-blue-500' :
                          'text-purple-500'
                        }`}>
                          {org.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{org.createdDate}</span>
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
                  {filteredOrgs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        No organizations found matching the criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Create Organization Modal with Flow */}
      <CreateOrganizationFlow
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrganizationCreated={(orgData) => {
          console.log('Organization created:', orgData);
          // TODO: Call API to create organization
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
