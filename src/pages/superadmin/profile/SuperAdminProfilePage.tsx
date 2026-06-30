import React, { useEffect, useState } from 'react';
import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar';
import { TopBar } from '@/components/layout/TopBar';

interface ProfileData {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  role: string;
  location: string;
  status: 'Active' | 'Inactive';
  totalOrganizations: number;
  activeOrganizations: number;
  pendingOrganizations: number;
  suspendedOrganizations: number;
}

const SuperAdminProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    surname: 'Matthews',
    email: 'john.matthews@example.com',
    phoneNumber: '+1 (555) 123-4567',
    role: 'Super Admin',
    location: 'Houston Office',
    status: 'Active',
    totalOrganizations: 12,
    activeOrganizations: 9,
    pendingOrganizations: 2,
    suspendedOrganizations: 1,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string | number) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    console.log('Profile data saved:', profileData);
    setHasChanges(false);
    // TODO: API call to save profile
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
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <TopBar
          pageTitle="Profile"
          userName={`${profileData.firstName} ${profileData.surname}`}
          userRole={profileData.role}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          showMenuButton={isMobile}
        />

        <main className="p-6 md:p-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C2410C] to-[#a83409] flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.firstName.charAt(0)}
                    {profileData.surname.charAt(0)}
                  </div>

                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {profileData.firstName} {profileData.surname}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{`Role: ${profileData.role}`}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {profileData.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveChanges}
                  disabled={!hasChanges}
                  className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                    hasChanges
                      ? 'bg-[#C2410C] hover:bg-[#a83409]'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Profile Form Section */}
            <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent"
                  />
                </div>

                {/* Surname */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Surname
                  </label>
                  <input
                    type="text"
                    value={profileData.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 cursor-not-allowed opacity-75"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <select
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent"
                  >
                    <option value="Houston Office">Houston Office</option>
                    <option value="New York Office">New York Office</option>
                    <option value="London Office">London Office</option>
                    <option value="Dubai Office">Dubai Office</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Statistics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {/* Total Organizations */}
                <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 border-l-2 border-l-[#C2410C]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Total Organizations
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profileData.totalOrganizations}
                  </p>
                </div>

                {/* Active Organizations */}
                <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 border-l-2 border-l-[#C2410C]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Active Organizations
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {profileData.activeOrganizations}
                  </p>
                </div>

                {/* Pending Organizations */}
                <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 border-l-2 border-l-[#C2410C]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Pending Organizations
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {profileData.pendingOrganizations}
                  </p>
                </div>

                {/* Suspended Organizations */}
                <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 border-l-2 border-l-[#C2410C]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Suspended Organizations
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {profileData.suspendedOrganizations}
                  </p>
                </div>
              </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminProfilePage;
