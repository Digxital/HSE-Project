import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { RecentReportsTable } from '@/components/dashboard/RecentReportsTable';
import { OrgSuspendedModal } from '@/components/common/OrgSuspendedModal';
import { getUserData } from '@/utils/authStorage';
import { useReports } from '@/services/ReportsContext';
import { useOrgStatusMonitor } from '@/hooks/useOrgStatusMonitor';

interface DashboardPageProps {
  role?: 'admin' | 'supervisor';
}
 
export const DashboardPage: React.FC<DashboardPageProps> = ({ role = 'admin' }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const userData = getUserData();
  const { reports, loading, refreshReports } = useReports();
  const { showSuspendedModal, handleDismiss } = useOrgStatusMonitor();

  const hasData = useMemo(() => !loading && reports.length > 0, [loading, reports.length]);

  const displayName = userData?.name || 'User';
  const displayRole = userData?.role
    ? userData.role === 'supervisor'
      ? 'Supervisor'
      : 'System Administrator'
    : role === 'supervisor'
      ? 'Supervisor'
      : 'System Administrator';

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

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
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
        role={role}
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
          <StatsOverview hasData={hasData} />
          <AIInsights hasData={hasData} />
          <RecentReportsTable hasData={hasData} />
        </div>
      </div>

      {/* Organization Suspended Modal */}
      <OrgSuspendedModal isOpen={showSuspendedModal} onDismiss={handleDismiss} />
    </div>
  );
};