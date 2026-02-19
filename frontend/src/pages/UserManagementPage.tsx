import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { userService, type UserResponse } from '@/services/userService';
import { useToast } from '@/hooks/useToast';
import { UserDetailsModal } from '@/components/users/UserDetailsModal';
import { CreateUserModal } from '@/components/users/CreateUserModal';
import InvitationSentModal from '@/components/auth/InvitationSentModal';
import { getUserData, type UserData } from '@/utils/authStorage';

type UserRole = 'All' | 'Admin' | 'Supervisor' | 'Field User' | 'HSE Officer';
type UserStatus = 'Active' | 'Deactivated' | 'Pending';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jobTitle: string;
  status: UserStatus;
  lastLogin: string;
}

export const UserManagementPage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showInvitationSentModal, setShowInvitationSentModal] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      console.log('📊 Raw user data:', data);
      
      // Ensure we have an array
      const usersArray = Array.isArray(data) ? data : [];
      
      // Transform API response with safe defaults
      const transformedUsers: User[] = usersArray.map((user: UserResponse) => ({
        id: user.id || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        jobTitle: user.jobPosition || '',
        status: (user.status as UserStatus) || 'Pending',
        lastLogin: user.lastLogin || 'Never',
      }));
      
      console.log('✅ Transformed users:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
      showToast({
        type: 'error',
        message: 'Failed to fetch users',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserCreated = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    jobPosition: string;
  }) => {
    try {
      setIsLoading(true);
      
      // Call API to create user
      const newUser = await userService.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        jobPosition: userData.jobPosition,
      });

      // Transform and add to local state
      const transformedUser: User = {
        id: newUser.id || '',
        firstName: newUser.firstName || userData.firstName,
        lastName: newUser.lastName || userData.lastName,
        email: newUser.email || userData.email,
        role: newUser.role || userData.role,
        jobTitle: newUser.jobPosition || userData.jobPosition,
        status: (newUser.status as UserStatus) || 'Pending',
        lastLogin: 'Never',
      };

      setUsers(prevUsers => [...prevUsers, transformedUser]);
      setShowCreateUserModal(false);
      
      setInvitationEmail(userData.email);
      setShowInvitationSentModal(true);

      showToast({
        type: 'success',
        message: 'User created successfully!',
      });
    } catch (error: any) {
      console.error('❌ Error in handleUserCreated:', error);
      showToast({
        type: 'error',
        message: error.message || 'Failed to create user',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvitation = async (userId: string) => {
    try {
      await userService.resendInvitation(userId);
      showToast({
        type: 'success',
        message: 'Invitation resent successfully',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to resend invitation',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userService.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      showToast({
        type: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to delete user',
      });
    }
  };

  const roles: { label: UserRole; count: number }[] = [
    { label: 'All', count: users.length },
    { label: 'Admin', count: users.filter((u) => u.role === 'ADMIN').length },
    { label: 'Supervisor', count: users.filter((u) => u.role === 'SUPERVISOR').length },
    { label: 'Field User', count: users.filter((u) => u.role === 'FIELD_USER').length },
    { label: 'HSE Officer', count: users.filter((u) => u.role === 'HSE_OFFICER').length },
  ];

  // Safe filtering with null checks
  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const email = user.email || '';
    const role = user.role || '';
    
    const matchesRole = selectedRole === 'All' || role === selectedRole;
    
    if (searchQuery === '') return matchesRole;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      role.toLowerCase().includes(searchLower);
      
    return matchesRole && matchesSearch;
  });

  const getStatusBadge = (status: UserStatus) => {
    const styles = {
      Active: 'text-green-600 bg-green-50',
      Deactivated: 'text-red-600 bg-red-50',
      Pending: 'text-yellow-600 bg-yellow-50',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-600' : status === 'Deactivated' ? 'bg-red-600' : 'bg-yellow-600'}`}></span>
        {status}
      </span>
    );
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <TopBar
          pageTitle="Dashboard"
          userName={user.name}
          userRole={user.role}
          syncStatus="synced"
          notificationCount={4}
          onMenuClick={handleMobileSidebarToggle}
          showMenuButton={isMobile}
        />

        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6" data-aos="fade-down">
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-lg font-semibold text-gray-900">Management Overview</h2>
              <button className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <Button 
              onClick={() => setShowCreateUserModal(true)}
              disabled={isLoading}
              className="bg-[#C24438] hover:bg-[#a03830] text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 justify-center text-sm md:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg">+</span> Create User
            </Button>
          </div>

          {/* Management Overview Section */}
          <div className="bg-[#FFFAF5] rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-aos="fade-up">
            <div className="p-3 md:p-6">
              {/* Role Filter Tabs */}
              <div className="mb-4" data-aos="fade-up" data-aos-delay="50">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-3 px-3 md:mx-0 md:px-0 lg:pb-0">
                  {roles.map((role) => (
                    <button
                      key={role.label}
                      onClick={() => setSelectedRole(role.label)}
                      className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                        selectedRole === role.label
                          ? 'bg-orange-50 text-[#C24438] border border-[#C24438]'
                          : 'bg-[#FFF9F5] text-gray-600 hover:bg-[#FFFEFB]'
                      }`}
                    >
                      {role.label}{' '}
                      <span
                        className={`ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-xs ${
                          selectedRole === role.label ? 'bg-[#C24438] text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {role.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-row gap-3 mb-6" data-aos="fade-up" data-aos-delay="100">
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search user, status, role...."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm"
                  />
                </div>
                <button className="px-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg hover:bg-[#FFFEFB] transition-colors flex items-center gap-2 text-sm font-medium text-gray-700 justify-center whitespace-nowrap">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span>Filter</span>
                </button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#C24438] border-t-transparent"></div>
                  <p className="mt-2 text-gray-500">Loading users...</p>
                </div>
              )}

              {/* User Table */}
              {!isLoading && (
                <div className="overflow-x-auto -mx-3 md:mx-0" data-aos="fade-up" data-aos-delay="150">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-[#FFF9F5] border-b border-gray-200">
                        <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Name</th>
                        <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Email</th>
                        <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Role</th>
                        <th className="hidden md:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                        <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">Last Login</th>
                        <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors border-l-4 border-l-[#C24438] border-b border-b-gray-200 cursor-pointer"
                          >
                            <td className="py-3 md:py-4 px-3 md:px-4">
                              <div className="font-medium text-gray-900 text-xs md:text-sm">
                                {user.firstName} {user.lastName}
                              </div>
                            </td>
                            <td className="py-3 md:py-4 px-3 md:px-4">
                              <div className="text-gray-600 text-xs md:text-sm">{user.email}</div>
                            </td>
                            <td className="py-3 md:py-4 px-3 md:px-4">
                              <div className="text-gray-900 text-xs md:text-sm">{user.role}</div>
                            </td>
                            <td className="hidden md:table-cell py-4 px-4">
                              <div className="text-gray-600">{user.jobTitle}</div>
                            </td>
                            <td className="hidden lg:table-cell py-4 px-4">{getStatusBadge(user.status)}</td>
                            <td className="hidden lg:table-cell py-4 px-4">
                              <div className="text-gray-600 text-sm whitespace-pre-line">{user.lastLogin}</div>
                            </td>
                            <td className="hidden lg:table-cell py-4 px-4">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle action menu
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="5" r="2" />
                                  <circle cx="12" cy="12" r="2" />
                                  <circle cx="12" cy="19" r="2" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={handleUserCreated}
      />

      {/* Invitation Sent Modal */}
      <InvitationSentModal
        isOpen={showInvitationSentModal}
        onClose={() => setShowInvitationSentModal(false)}
        email={invitationEmail}
      />
    </div>
  );
};