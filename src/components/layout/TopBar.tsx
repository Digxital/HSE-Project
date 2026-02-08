import React, { useState } from 'react';

interface TopBarProps {
  pageTitle: string;
  userName: string;
  userRole: string;
  syncStatus?: 'synced' | 'syncing' | 'error';
  notificationCount?: number;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  pageTitle,
  userName,
  userRole,
  syncStatus = 'synced',
  notificationCount = 0,
  onMenuClick,
  showMenuButton = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getSyncStatusConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          text: 'All Synced',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-600',
        };
      case 'syncing':
        return {
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
          text: 'Syncing...',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-600',
        };
      case 'error':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          text: 'Sync Error',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          iconColor: 'text-red-600',
        };
    }
  };

  const syncConfig = getSyncStatusConfig();

  return (
    <div className="bg-white border-b border-gray-100 px-4 md:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Mobile Menu Button */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Page Title */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{pageTitle}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Sync Status - Hidden on mobile */}
          <div
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full ${syncConfig.bgColor}`}
          >
            <span className={syncConfig.iconColor}>{syncConfig.icon}</span>
            <span className={`text-sm font-medium ${syncConfig.textColor}`}>{syncConfig.text}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown - TODO */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  <p className="text-sm text-gray-500">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 md:space-x-3 p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm md:text-base">
                  {userName.charAt(0)}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <svg className="hidden md:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown - TODO */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Settings
                  </button>
                  <hr className="my-2" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};