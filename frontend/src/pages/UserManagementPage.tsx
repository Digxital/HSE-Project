import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { userService, type UserResponse } from '@/services/userService';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import InvitationSentModal from '@/components/auth/InvitationSentModal';
import { getUserData, type UserData } from '@/utils/authStorage';
import { UserDetailsModal } from '@/components/users/UserDetailsModal';
import { microsoft365Service, type MicrosoftGraphUser } from '@/services/microsoft365Service';

type UserRole = 'All' | 'PENDING' | 'ADMIN' | 'SUPERVISOR' | 'FIELD_USER' | 'HSE_OFFICER';
type UserStatus = 'Active' | 'Deactivated' | 'Pending';
type ActiveTab = 'platform' | 'microsoft';

interface User {
  id: string;
  _id?: string; 
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jobTitle: string;
  status: UserStatus;
  lastLogin: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
  microsoftUserId?: string;
}

interface MicrosoftUser {
  id: string;
  displayName: string;
  email: string;
  jobTitle: string;
  department: string;
  synced: boolean;
  platformUserId?: string;
  importedAt?: string | null;
}

// Pagination component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === i + 1
                    ? 'z-10 bg-[#C24438] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C24438]'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export const UserManagementPage: React.FC = () => {
  const { handleLogout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('All');
  const [activeTab, setActiveTab] = useState<ActiveTab>('platform');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showInvitationSentModal, setShowInvitationSentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [microsoftUsers, setMicrosoftUsers] = useState<MicrosoftUser[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { addNotification } = useNotifications();
   
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    }; 
    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchUsers();
    fetchMicrosoftUsers();
  }, []);

 const fetchUsers = async () => {
    setIsLoading(true);
    try { 
      const data = await userService.getUsers();
      console.log('📊 Raw user data:', data);
      
      const usersArray = Array.isArray(data) ? data : [];
      
      const transformedUsers: User[] = usersArray.map((user: UserResponse) => {
        // Handle status - API returns "PENDING" (uppercase)
        let status: UserStatus = 'Pending';
        if (user.status) {
          const upperStatus = user.status.toUpperCase();
          if (upperStatus === 'ACTIVE') status = 'Active';
          else if (upperStatus === 'PENDING') status = 'Pending';
          else if (upperStatus === 'INACTIVE' || upperStatus === 'DEACTIVATED') status = 'Deactivated';
        }
        
        // Handle role - API returns null for pending users
        const role = user.role || '';
        
        return {
          id: user._id || user.id || '', 
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          role: role,
          jobTitle: user.jobPosition || 'Not specified',
          status: status,
          lastLogin: 'Never',
          tenantId: user.tenantId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          microsoftUserId: user.microsoftUserId,
        };
      });

      const sortedUsers = transformedUsers.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      setUsers(sortedUsers);
      setCurrentPage(1);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    } finally {
      setIsLoading(false);
    }
  };

 const fetchMicrosoftUsers = async () => {
    try {
      const msUsers = await microsoft365Service.getUsers();
      const platformUsers = await userService.getUsers();
      const platformEmails = new Set(platformUsers.map(u => u.email));
      
      // Create a map of platform users by email for quick lookup
      const platformUserMap = new Map(platformUsers.map(u => [u.email, u]));
      
      // Also get sync timestamps from platform users (when they were imported)
      // const userImportDates = new Map(
      //   platformUsers.map(u => [u.email, new Date(u.createdAt || 0).getTime()])
      // );
      
      const transformed: MicrosoftUser[] = msUsers.map((mu: MicrosoftGraphUser) => {
        const email = mu.emailAddress || mu.userPrincipalName;
        const platformUser = platformUserMap.get(email);
        
        return {
          id: mu.id,
          displayName: mu.displayName,
          email: email,
          jobTitle: mu.jobTitle || 'Not specified',
          department: mu.department || 'Not specified',
          synced: platformEmails.has(email),
          platformUserId: platformUser?.id,
          importedAt: platformUser?.createdAt || null, // Store import date
        };
      });
      
      // ✅ FIX: Sort by import date (most recent first) then synced status
      const sorted = transformed.sort((a, b) => {
        // If both are synced, sort by import date (newest first)
        if (a.synced && b.synced) {
          const dateA = a.importedAt ? new Date(a.importedAt).getTime() : 0;
          const dateB = b.importedAt ? new Date(b.importedAt).getTime() : 0;
          return dateB - dateA; // Descending (newest first)
        }
        
        // Synced users come before non-synced
        if (a.synced && !b.synced) return -1;
        if (!a.synced && b.synced) return 1;
        
        // If neither is synced, sort alphabetically
        return a.displayName.localeCompare(b.displayName);
      });
      
      setMicrosoftUsers(sorted);
    } catch (error) {
      console.error('Error fetching Microsoft users:', error);
    }
  } 

  const syncMicrosoftUsers = async () => {
    try {
      setIsLoading(true);
      
      console.log('🔑 Testing Microsoft token...');
      let msUsers;
      
      try {
        msUsers = await microsoft365Service.getUsers();
        console.log('✅ Microsoft token works, found', msUsers.length, 'users');
      } catch (tokenError) {
        console.error('❌ Microsoft token error:', tokenError);
        showToast({
          type: 'error',
          message: 'Microsoft authentication failed. Please logout and login again.'
        });
        setIsLoading(false);
        return;
      }
      
      const platformUsers = await userService.getUsers();
      const platformEmails = new Set(platformUsers.map(u => u.email));
      
      const newUsers = msUsers.filter(
        (mu: any) => !platformEmails.has(mu.mail || mu.userPrincipalName)
      );
      
      if (newUsers.length === 0) {
        showToast({
          type: 'success',
          message: 'No new users to sync'
        });
        await fetchMicrosoftUsers();
        setIsLoading(false);
        return;
      }
      
      let imported = 0;
      let failed = 0;
      const newlyCreatedUsers: UserResponse[] = [];
      
      for (const mu of newUsers) {
        try {
          const firstName = mu.givenName || mu.displayName?.split(' ')[0] || 'Unknown';
          const lastName = mu.surname || mu.displayName?.split(' ').slice(1).join(' ') || 'User';
          const email = mu.emailAddress || mu.userPrincipalName;
          
          
          const newUser = await userService.createUser({
            firstName,
            lastName,
            email,
            role: 'FIELD_USER',
            jobPosition: mu.jobTitle || 'Not specified',
            createMicrosoftAccount: false,
            status: 'pending'
          });
          // ✅ Add notification for each successfully imported user
          addNotification({
            type: 'user_added',
            title: 'New User Added',
            description: `${firstName} ${lastName} (${email}) has been added to the platform.`,
            timestamp: new Date().toISOString(),
          });
          // addNotification({
          //   type: 'user_added',
          //   title: 'New User Created',
          //   description: `${userData.firstName} ${userData.lastName} (${userData.email}) has been created.`,
          //   timestamp: new Date().toISOString(),
          // });
           
          newlyCreatedUsers.push(newUser);
          imported++;
        } catch (err) {
          console.error('Failed to import user:', mu.emailAddress || mu.userPrincipalName, err);
          failed++;
        }
      }
      
      // Transform new users to match User interface
      const transformedNewUsers = newlyCreatedUsers.map(user => {
        let status: UserStatus = 'Pending';
        if (user.status) {
          const upperStatus = user.status.toUpperCase();
          if (upperStatus === 'ACTIVE') status = 'Active';
          else if (upperStatus === 'PENDING') status = 'Pending';
          else if (upperStatus === 'INACTIVE' || upperStatus === 'DEACTIVATED') status = 'Deactivated';
        }
        
        return {
          id: user._id || user.id || '',
          _id: user._id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          role: 'Pending', // This is for display in the UI
          jobTitle: user.jobPosition || 'Not specified',
          status: status,
          lastLogin: 'Never',
          tenantId: user.tenantId,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt,
          microsoftUserId: user.microsoftUserId,
        };
      });
      
      // ✅ FIX 1: Update platform users with new data (names will appear immediately)
      setUsers(prevUsers => {
        // Create a Set of existing emails to avoid duplicates
        const existingEmails = new Set(prevUsers.map(u => u.email));
        
        // Filter out any duplicates
        const uniqueNewUsers = transformedNewUsers.filter(
          newUser => !existingEmails.has(newUser.email)
        );
        
        // Put new users at the TOP of platform list
        return [...uniqueNewUsers, ...prevUsers];
      });
      
      // ✅ FIX 2: Update Microsoft users table with new users at the TOP
      // First, get current Microsoft users
      const currentMicrosoftUsers = [...microsoftUsers];
      
      // Create new Microsoft user entries for the imported users
      const newMicrosoftEntries: MicrosoftUser[] = transformedNewUsers.map(user => ({
        id: user.microsoftUserId || user.id,
        displayName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        jobTitle: user.jobTitle,
        department: 'Not specified',
        synced: true,
        platformUserId: user.id,
      }));
      
      // Filter out duplicates from existing Microsoft users
      const existingMicrosoftIds = new Set(currentMicrosoftUsers.map(u => u.id));
      const uniqueNewMicrosoftEntries = newMicrosoftEntries.filter(
        entry => !existingMicrosoftIds.has(entry.id)
      );
       
      // ✅ Put new Microsoft users at the TOP of the Microsoft tab
      setMicrosoftUsers([...uniqueNewMicrosoftEntries, ...currentMicrosoftUsers]);
      // ✅ FIX: Fetch fresh data from server instead of manual state updates
      await fetchUsers(); // This will get all users with correct status, role, etc.
      await fetchMicrosoftUsers(); // Refresh Microsoft users table
      
      showToast({
        type: 'success',
        message: `Imported ${imported} users`
      });
      
    } catch (error: any) {
      console.error('Sync failed:', error);
      showToast({
        type: 'error',
        message: error.message || 'Failed to sync users'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: 'Active' | 'Deactivated' | 'Pending') => {
    try {
      setIsLoading(true);
      
      await userService.updateUser(userId, { status: newStatus.toLowerCase() as any });
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      if (selectedUser?.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      showToast({
        type: 'success',
        message: `User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast({
        type: 'error',
        message: `Failed to ${newStatus === 'Active' ? 'activate' : 'deactivate'} user`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      
      await userService.deleteUser(userId);
      
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setOpenMenuId(null);
      
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      
      await fetchMicrosoftUsers();
      
      showToast({
        type: 'success',
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      showToast({
        type: 'error',
        message: error.message || 'Failed to delete user',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      setIsLoading(true);
      
      const newStatus = user.status === 'Active' ? 'Deactivated' : 'Active';
      
      await userService.updateUser(user.id, { status: newStatus.toLowerCase() as any });
      
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );
      
      setOpenMenuId(null); 
      
      showToast({
        type: 'success',
        message: `User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      showToast({
        type: 'error',
        message: error.message || `Failed to ${user.status === 'Active' ? 'deactivate' : 'activate'} user`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Platform Users - Role counts
  const roles: { label: UserRole; count: number }[] = [
    { label: 'All', count: users.length },
    { label: 'PENDING', count: users.filter((u) => !u.role || u.role === '').length },
    { label: 'ADMIN', count: users.filter((u) => u.role === 'ADMIN').length },
    { label: 'SUPERVISOR', count: users.filter((u) => u.role === 'SUPERVISOR').length },
    { label: 'FIELD_USER', count: users.filter((u) => u.role === 'FIELD_USER').length },
    { label: 'HSE_OFFICER', count: users.filter((u) => u.role === 'HSE_OFFICER').length },
  ];

  // Filter platform users
  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const email = user.email || '';
    const role = user.role || '';
    
    const matchesRole = selectedRole === 'All' || 
      (selectedRole === 'PENDING' && !user.role) ||
      role === selectedRole;
    
    if (searchQuery === '') return matchesRole;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      role.toLowerCase().includes(searchLower);
      
    return matchesRole && matchesSearch;
  });

  // Filter Microsoft users
  const filteredMicrosoftUsers = microsoftUsers.filter((user) => {
    if (!user) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      user.displayName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.jobTitle.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(
    (activeTab === 'platform' ? filteredUsers.length : filteredMicrosoftUsers.length) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlatformUsers = filteredUsers.slice(startIndex, endIndex);
  const currentMicrosoftUsers = filteredMicrosoftUsers.slice(startIndex, endIndex);

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

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'SUPERVISOR': 'bg-blue-100 text-blue-800',
      'FIELD_USER': 'bg-green-100 text-green-800',
      'HSE_OFFICER': 'bg-orange-100 text-orange-800',
    };

    const displayRole = role.replace('_', ' ');
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {displayRole}
      </span>
    );
  };

  const getSyncBadge = (synced: boolean) => {
    return synced ? (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Synced
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Not Synced
      </span>
    ); 
  };

  const handleMobileSidebarToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.querySelector('.user-table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
    if (tab === 'microsoft') {
      fetchMicrosoftUsers();
    }
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
          pageTitle="User Management"
          userName={user.name}
          userRole={user.role}
          syncStatus="synced"
          notificationCount={4}
          onMenuClick={handleMobileSidebarToggle} 
          showMenuButton={isMobile}
          onLogout={handleLogout}
        />

        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6" data-aos="fade-down">
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-lg font-semibold text-gray-900">User Management</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {activeTab === 'platform' ? `Platform: ${users.length}` : `Microsoft: ${microsoftUsers.length}`}
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={syncMicrosoftUsers}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base whitespace-nowrap disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Microsoft
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => handleTabChange('platform')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'platform'
                  ? 'text-[#C24438] border-b-2 border-[#C24438]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Platform Users
            </button>
            <button
              onClick={() => handleTabChange('microsoft')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'microsoft'
                  ? 'text-[#C24438] border-b-2 border-[#C24438]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Microsoft 365 Users
            </button>
          </div>

          {/* Management Overview Section */}
          <div className="bg-[#FFFAF5] rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-aos="fade-up">
            <div className="p-3 md:p-6">
              {/* Role Filter Tabs - Only show for Platform tab */}
              {activeTab === 'platform' && (
                <div className="mb-4" data-aos="fade-up" data-aos-delay="50">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-3 px-3 md:mx-0 md:px-0 lg:pb-0">
                    {roles.map((role) => (
                      <button
                        key={role.label}
                        onClick={() => {
                          setSelectedRole(role.label);
                          setCurrentPage(1);
                        }}
                        className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                          selectedRole === role.label
                            ? 'bg-orange-50 text-[#C24438] border border-[#C24438]'
                            : 'bg-[#FFF9F5] text-gray-600 hover:bg-[#FFFEFB]'
                        }`}
                      >
                        {role.label === 'PENDING' ? 'Pending' : role.label.replace('_', ' ')}{' '}
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
              )}

              {/* Search */}
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
                    placeholder={activeTab === 'platform' 
                      ? "Search by name, email, or role..." 
                      : "Search Microsoft users by name, email, or job title..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#C24438] border-t-transparent"></div>
                  <p className="mt-2 text-gray-500">Loading users...</p>
                </div>
              )}

              {/* Platform Users Table */}
              {!isLoading && activeTab === 'platform' && (
                <div className="user-table-container">
                  <div className="overflow-x-auto -mx-3 md:mx-0" data-aos="fade-up" data-aos-delay="150">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-[#FFF9F5] border-b border-gray-200">
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">#</th>
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Name</th>
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Email</th>
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Role</th>
                          <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">Created</th>
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPlatformUsers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-gray-500">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          currentPlatformUsers.map((user, index) => (
                            <tr 
                              key={user.id} 
                              onClick={() => setSelectedUser(user)}
                              className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors border-l-4 border-l-[#C24438] border-b border-b-gray-200 cursor-pointer"
                            >
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                <div className="text-gray-500 text-xs md:text-sm">
                                  {startIndex + index + 1}
                                </div>
                              </td>
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                <div className="font-medium text-gray-900 text-xs md:text-sm">
                                  {user.firstName} {user.lastName}
                                </div>
                              </td>
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                <div className="text-gray-600 text-xs md:text-sm">{user.email}</div>
                              </td>
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                {user.role ? getRoleBadge(user.role) : (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="hidden lg:table-cell py-4 px-4">
                                {getStatusBadge(user.status)}
                              </td>
                              <td className="hidden lg:table-cell py-4 px-4">
                                <div className="text-gray-600 text-sm">
                                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                              </td>
                              <td className="py-3 md:py-4 px-3 md:px-4 relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === user.id ? null : user.id);
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="12" cy="19" r="2" />
                                  </svg>
                                </button>
                                
                                {/* Dropdown Menu */}
                                {openMenuId === user.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-40"
                                      onClick={() => setOpenMenuId(null)}
                                    />
                                    
                                    <div className="absolute right-0 mt-2 w-56 bg-[#FFFEFB] rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedUser(user);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-[#FFF9F5] flex items-center gap-3 transition-colors"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        View Details
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleUserStatus(user);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-[#FFF9F5] flex items-center gap-3 transition-colors"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          {user.status === 'Active' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                          ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          )}
                                        </svg>
                                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                      </button>
                                      
                                      <div className="border-t border-gray-200 my-2"></div>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteUser(user.id);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {filteredUsers.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              )}

              {/* Microsoft Users Table */}
              {!isLoading && activeTab === 'microsoft' && (
                <div className="user-table-container">
                  <div className="overflow-x-auto -mx-3 md:mx-0" data-aos="fade-up" data-aos-delay="150">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-[#FFF9F5] border-b border-gray-200">
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">#</th>
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Name</th>
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Email</th>
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Job Title</th>
                          <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">Department</th>
                          <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentMicrosoftUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                              No Microsoft users found
                            </td>
                          </tr>
                        ) : (
                          currentMicrosoftUsers.map((user, index) => (
                            <tr 
                              key={user.id} 
                              className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors border-l-4 border-l-blue-500 border-b border-b-gray-200"
                            >
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                <div className="text-gray-500 text-xs md:text-sm">
                                  {startIndex + index + 1}
                                </div>
                              </td>
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                <div className="font-medium text-gray-900 text-xs md:text-sm">
                                  {user.displayName}
                                </div>
                              </td>
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                <div className="text-gray-600 text-xs md:text-sm">{user.email}</div>
                              </td>
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                <div className="text-gray-600 text-xs md:text-sm">{user.jobTitle}</div>
                              </td>
                              <td className="hidden lg:table-cell py-4 px-4">
                                <div className="text-gray-600 text-sm">{user.department}</div>
                              </td>
                              <td className="py-3 md:py-4 px-3 md:px-4">
                                {getSyncBadge(user.synced)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {filteredMicrosoftUsers.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser ? {
          id: selectedUser.id, // This should be the correct ID
          name: `${selectedUser.firstName} ${selectedUser.lastName}`,
          firstName: selectedUser.firstName,
          surname: selectedUser.lastName,
          email: selectedUser.email,
          role: selectedUser.role,
          location: selectedUser.jobTitle || 'Not specified',
          status: selectedUser.status,
          lastLogin: selectedUser.lastLogin,
          dateAdded: selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : undefined,
          stats: {
            reportsSubmitted: 15,
            actionsAssigned: 0,
            validCertifications: 4,
            expiredCertifications: selectedUser.status === 'Deactivated' ? 1 : 0,
          }
        } : null}
        onUpdateUserStatus={updateUserStatus}
        onUserUpdated={fetchUsers} // Add this line
      />

      

      {/* Invitation Sent Modal */}
      <InvitationSentModal
        isOpen={showInvitationSentModal}
        onClose={() => setShowInvitationSentModal(false)}
        title="Microsoft Account Created"
        message="The user can now log into the mobile app with their Microsoft credentials"
      />
    </div>
  );
};