import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { FeedbackModal } from '@/components/common/FeedbackModal';

interface SuperAdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/superadmin/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
      ),
    },
    {
      label: 'Organization',
      path: '/superadmin/organization',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      path: '/superadmin/profile',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Setting',
      path: '/superadmin/settings',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-bold text-lg text-gray-900 dark:text-white">Aegix</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.path}>
              <Link
                to={item.path}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>

              {/* Submenu */}
              {item.submenu && !isCollapsed && (
                <div className="ml-4 space-y-1 mt-1">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.path}
                      to={subitem.path}
                      onClick={onMobileClose}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive(subitem.path)
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                          : 'text-gray-600 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {!isCollapsed ? (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            {/* Feedback Section */}
            <div className="bg-[#FFF4E6] dark:bg-[#200500] rounded-xl p-4 mb-4">
              <div className="flex flex-col">
                <span className="text-2xl mb-2">👍</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Tell us what's working and what's not</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">We're building Aegix for you.</p>
                <button onClick={() => setIsFeedbackOpen(true)} className="flex items-center gap-2 w-max px-4 py-2 bg-white dark:bg-[#0D0D0D] border border-[#C2410C]/20 rounded-full text-xs font-semibold text-gray-900 dark:text-white shadow-sm hover:shadow transition-all">
                  Give Feedback <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]"></span>
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => navigate('/superadmin/login')}
              className="flex items-center gap-3 w-full px-4 py-3 text-[#C2410C] hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium text-sm border-t border-transparent"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-center">
            <button
              onClick={() => navigate('/superadmin/login')}
              className="p-2 text-[#C2410C] hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
              title="Log out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </aside>

      {/* Feedback Modal - Rendered outside sidebar for full screen centering */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
};
