import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

export const SuperAdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/superadmin/dashboard', icon: '📊' },
    { label: 'Organizations', path: '/superadmin/organizations', icon: '🏢' },
    { label: 'Users', path: '/superadmin/users', icon: '👥' },
    { label: 'Settings', path: '/superadmin/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#200500] text-white transition-all duration-300 overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-center border-b border-gray-700">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-bold text-lg">Aegix</span>
            </div>
          )}
        </div>

        {/* Admin Badge */}
        <div className={`${sidebarOpen ? 'px-6' : 'px-3'} py-4`}>
          <span className="inline-block bg-gray-600 text-xs font-bold px-3 py-1 rounded">
            ADMIN
          </span>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-[#C2410C] text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
          </div>

          <button className="w-10 h-10 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors flex items-center justify-center text-sm font-bold">
            SA
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
