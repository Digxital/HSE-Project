import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export const SettingsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Settings"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
          userName="Peter Omogbolahan"
          userRole="System Administrator"
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Settings Container */}
            <div className="bg-[#FFFAF5] rounded-xl p-6 md:p-8 border border-gray-100 min-h-[400px]">
              {/* Empty state - Settings content would go here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
