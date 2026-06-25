import React, { useEffect, useState } from 'react';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';

export const SuperAdminDashboardPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          userName="Peter Omogbolahan"
          userRole="Admin"
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
                { label: 'Total Organizations', value: '248', icon: '🏢', trend: '+18 since last month' },
                { label: 'Active Organizations', value: '23', icon: '✅', trend: '12 active' },
                { label: 'Pending Organizations', value: '41', icon: '⏳', trend: '8 pending' },
                { label: 'Suspended Organizations', value: '41', icon: '🚫', trend: '2 suspended' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-800 dark:text-gray-300 text-sm font-medium">
                      {stat.label}
                    </p>
                    <a href="#" className="text-xs text-green-500 hover:text-green-600 flex items-center gap-1">
                      View all ↗
                    </a>
                  </div>
                  <div className="mb-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </h3>
                  </div>
                  <p className={`text-xs ${
                    idx === 3 ? 'text-red-500' : idx === 2 ? 'text-yellow-600' : idx === 1 ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {idx === 0 && <span className="inline-block mr-1">↑</span>}
                    {idx === 1 && <span className="inline-block w-2 h-2 rounded-full mr-1 opacity-70 bg-green-500" />}
                    {idx === 2 && <span className="inline-block w-4 h-4 mr-1 text-yellow-600 -ml-1 text-lg leading-none align-middle">◷</span>}
                    {idx === 3 && <span className="inline-block w-3 h-3 mr-1 rounded-full border border-red-500 text-red-500 text-center leading-none text-[8px] align-middle">/</span>}
                    {stat.trend}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center mt-32 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 relative">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0D0D0D] rounded-full p-0.5">
                <span className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold font-sans">×</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#200500] dark:text-white mb-2">No Reports Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No reports have been submitted for this period.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
