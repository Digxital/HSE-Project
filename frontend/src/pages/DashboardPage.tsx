import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { RecentReportsTable } from '@/components/dashboard/RecentReportsTable';
import { getUserData, type UserData } from '@/utils/authStorage';

export const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hasData = true; // Change to false to see empty state

  // Check if mobile on mount and window resize
  useEffect(() => {
    const userData = getUserData();
    setUser(userData);

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
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Backdrop for mobile sidebar */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
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
          userName={user.name}
          userRole={user.role}
          syncStatus="synced"
          notificationCount={4}
          onMenuClick={handleMobileSidebarToggle}
          showMenuButton={isMobile}
        />

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <StatsOverview hasData={hasData} />
          <AIInsights hasData={hasData} />
          <RecentReportsTable hasData={hasData} />
        </div>
      </div>
    </div>
  );
};