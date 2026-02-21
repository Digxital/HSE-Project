import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { UserDetailsModal } from '@/components/users/UserDetailsModal';
import { CreateUserModal } from '@/components/users/CreateUserModal';
import InvitationSentModal from '@/components/auth/InvitationSentModal';

type UserRole = 'All' | 'Admin' | 'Supervisor' | 'Field User' | 'HSE Officer';
type UserStatus = 'Active' | 'Deactivated' | 'Pending';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  status: UserStatus;
  lastLogin: string;
}

export const UserManagementPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showInvitationSentModal, setShowInvitationSentModal] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Matthews',
      email: 'john@inveraenergy.com',
      role: 'Admin',
      location: 'Houston Office',
      status: 'Active',
      lastLogin: '21 Jan 2026\n09:42 AM',
    },
    {
      id: '2',
      name: 'Aisha Bello',
      email: 'aisha.bello@inveraenergy.com',
      role: 'Supervisor',
      location: 'North Sea Plat.',
      status: 'Active',
      lastLogin: '21 Jan 2026\n06:15 PM',
    },
    {
      id: '3',
      name: 'Mark Thompson',
      email: 'mthompson@inveraenergy.com',
      role: 'Field User',
      location: 'Gulf of Mexico',
      status: 'Active',
      lastLogin: '19 Jan 2026\n04:03 PM',
    },
    {
      id: '4',
      name: 'Samuel Okoje',
      email: 'sam.okoje@inveraenergy.com',
      role: 'Field User',
      location: 'Alaska Pipeline',
      status: 'Deactivated',
      lastLogin: '21 Jan 2026\n06:15 PM',
    },
    {
      id: '5',
      name: 'Linda Chen',
      email: 'linda.chen@inveraenergy.com',
      role: 'Supervisor',
      location: 'Singapore Refi.',
      status: 'Pending',
      lastLogin: '21 Jan 2026\n06:15 PM',
    },
  ]);

  const updateUserStatus = (userId: string, newStatus: UserStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    // Update selected user if it's the one being modified
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const createNewUser = (userData: {
    firstName: string;
    surname: string;
    email: string;
    role: string;
    jobPosition: string;
  }) => {
    const newUser: User = {
      id: String(users.length + 1),
      name: `${userData.firstName} ${userData.surname}`,
      email: userData.email,
      role: userData.role,
      location: userData.jobPosition, // Using job position as location
      status: 'Pending',
      lastLogin: 'Never',
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setShowCreateUserModal(false);
    
    // Show success modal
    setInvitationEmail(userData.email);
    setShowInvitationSentModal(true);
  };

  const roles: { label: UserRole; count: number }[] = [
    { label: 'All', count: users.length },
    { label: 'Admin', count: users.filter((u) => u.role === 'Admin').length },
    { label: 'Supervisor', count: users.filter((u) => u.role === 'Supervisor').length },
    { label: 'Field User', count: users.filter((u) => u.role === 'Field User').length },
    { label: 'HSE Officer', count: users.filter((u) => u.role === 'HSE Officer').length },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
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
          userName="Peter Omogbolahan"
          userRole="Admin"
          notificationCount={4}
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
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
              className="bg-[#C24438] hover:bg-[#a03830] text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 justify-center text-sm md:text-base whitespace-nowrap"
            >
              <span className="text-lg">+</span> Create User
            </Button>
          </div>

          {/* Management Overview Section */}
          <div className="bg-[#FFFAF5] rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-aos="fade-up">
            <div className="p-3 md:p-6">
              {/* Role Filter Tabs */}
              <div className="mb-4" data-aos="fade-up" data-aos-delay="50">
                {/* Role Tabs - Full width on mobile, scrollable */}
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

              {/* User Table */}
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
                        {filteredUsers.map((user) => (
                          <tr 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors border-l-4 border-l-[#C24438] border-b border-b-gray-200 cursor-pointer"
                          >
                            <td className="py-3 md:py-4 px-3 md:px-4">
                              <div className="font-medium text-gray-900 text-xs md:text-sm">
                                {user.name}
                              </div>
                            </td>
                            <td className="py-3 md:py-4 px-3 md:px-4">
                              <div className="text-gray-600 text-xs md:text-sm">{user.email}</div>
                            </td>
                            <td className="py-3 md:py-4 px-3 md:px-4">
                              <div className="text-gray-900 text-xs md:text-sm">{user.role}</div>
                            </td>
                            <td className="hidden md:table-cell py-4 px-4">
                              <div className="text-gray-600">{user.location}</div>
                            </td>
                            <td className="hidden lg:table-cell py-4 px-4">{getStatusBadge(user.status)}</td>
                            <td className="hidden lg:table-cell py-4 px-4">
                              <div className="text-gray-600 text-sm whitespace-pre-line">{user.lastLogin}</div>
                            </td>
                            <td className="hidden lg:table-cell py-4 px-4 relative">
                              <div className="relative inline-block">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === user.id ? null : user.id);
                                  }}
                                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="12" cy="19" r="2" />
                                  </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {openMenuId === user.id && (
                                  <div className="absolute right-full top-0 mr-1 w-48 bg-[#FFFEFB] rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUser(user);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#FFF9F5] flex items-center gap-3 transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Edit User
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUser(user);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#FFF9F5] flex items-center gap-3 transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      {user.status === 'Active' ? 'Deactivate' : 'Reactivate User'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        onUpdateUserStatus={updateUserStatus}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onCreateUser={createNewUser}
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








































// import React, { useState } from 'react';
// import { Sidebar } from '@/components/layout/Sidebar';
// import { TopBar } from '@/components/layout/TopBar';
// import { Button } from '@/components/ui/Button';

// type UserRole = 'All' | 'Admin' | 'Supervisor' | 'Field User' | 'HSE Officer';
// type UserStatus = 'Active' | 'Deactivated' | 'Pending';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   location: string;
//   status: UserStatus;
//   lastLogin: string;
// }

// // Mock data
// const mockUsers: User[] = [
//   {
//     id: '1',
//     name: 'John Matthews',
//     email: 'john@inveraenergy.com',
//     role: 'Admin',
//     location: 'Houston Office',
//     status: 'Active',
//     lastLogin: '21 Jan 2026\n09:42 AM',
//   },
//   {
//     id: '2',
//     name: 'Aisha Bello',
//     email: 'aisha.bello@inveraenergy.com',
//     role: 'Supervisor',
//     location: 'North Sea Plat.',
//     status: 'Active',
//     lastLogin: '21 Jan 2026\n06:15 PM',
//   },
//   {
//     id: '3',
//     name: 'Mark Thompson',
//     email: 'mthompson@inveraenergy.com',
//     role: 'Field User',
//     location: 'Gulf of Mexico',
//     status: 'Active',
//     lastLogin: '19 Jan 2026\n04:03 PM',
//   },
//   {
//     id: '4',
//     name: 'Samuel Okoje',
//     email: 'sam.okoje@inveraenergy.com',
//     role: 'Field User',
//     location: 'Alaska Pipeline',
//     status: 'Deactivated',
//     lastLogin: '21 Jan 2026\n06:15 PM',
//   },
//   {
//     id: '5',
//     name: 'Linda Chen',
//     email: 'linda.chen@inveraenergy.com',
//     role: 'Supervisor',
//     location: 'Singapore Refi.',
//     status: 'Pending',
//     lastLogin: '21 Jan 2026\n06:15 PM',
//   },
// ];

// export const UserManagementPage: React.FC = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState<UserRole>('All');
//   const [searchQuery, setSearchQuery] = useState('');

//   const roles: { label: UserRole; count: number }[] = [
//     { label: 'All', count: mockUsers.length },
//     { label: 'Admin', count: mockUsers.filter((u) => u.role === 'Admin').length },
//     { label: 'Supervisor', count: mockUsers.filter((u) => u.role === 'Supervisor').length },
//     { label: 'Field User', count: mockUsers.filter((u) => u.role === 'Field User').length },
//     { label: 'HSE Officer', count: mockUsers.filter((u) => u.role === 'HSE Officer').length },
//   ];

//   const filteredUsers = mockUsers.filter((user) => {
//     const matchesRole = selectedRole === 'All' || user.role === selectedRole;
//     const matchesSearch =
//       searchQuery === '' ||
//       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.role.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesRole && matchesSearch;
//   });

//   const getStatusBadge = (status: UserStatus) => {
//     const styles = {
//       Active: 'text-green-600 bg-green-50',
//       Deactivated: 'text-red-600 bg-red-50',
//       Pending: 'text-yellow-600 bg-yellow-50',
//     };

//     return (
//       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
//         <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-600' : status === 'Deactivated' ? 'bg-red-600' : 'bg-yellow-600'}`}></span>
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-background-light">
//       <Sidebar
//         isCollapsed={sidebarCollapsed}
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//         isMobileOpen={mobileMenuOpen}
//         onMobileClose={() => setMobileMenuOpen(false)}
//       />

//       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
//         <TopBar 
//           pageTitle="User Management"
//           userName="Peter Omogbolahan"
//           userRole="Admin"
//           onMenuClick={() => setMobileMenuOpen(true)}
//           showMenuButton={true}
//         />

//         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6" data-aos="fade-down">
//             <div className="flex items-center gap-2">
//               <h2 className="text-lg font-semibold text-gray-900">Management Overview</h2>
//               <button className="text-gray-400 hover:text-gray-600 transition-colors">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <Button className="bg-[#C24438] hover:bg-[#a03830] text-white px-4 py-2 rounded-lg flex items-center gap-2">
//               <span className="text-lg">+</span> Create User
//             </Button>
//           </div>

//           {/* Management Overview Section */}
//           <div className="bg-[#FFFAF5] rounded-l-xl shadow-sm border-l border-t border-b border-gray-100 p-6 mb-6" data-aos="fade-up" data-aos-delay="0">
//             {/* Role Filter Tabs and Search in Same Row */}
//             <div className="flex items-center justify-between gap-4 mb-6" data-aos="fade-up" data-aos-delay="50">
//               {/* Role Tabs */}
//               <div className="flex items-center gap-2">
//                 {roles.map((role) => (
//                   <button
//                     key={role.label}
//                     onClick={() => setSelectedRole(role.label)}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
//                       selectedRole === role.label
//                         ? 'bg-orange-50 text-[#C24438] border border-[#C24438]'
//                         : 'bg-[#FFF9F5] text-gray-600 hover:bg-[#FFFEFB]'
//                     }`}
//                   >
//                     {role.label}{' '}
//                     <span
//                       className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
//                         selectedRole === role.label ? 'bg-[#C24438] text-white' : 'bg-gray-200 text-gray-600'
//                       }`}
//                     >
//                       {role.count}
//                     </span>
//                   </button>
//                 ))}
//               </div>

//               {/* Search and Filter */}
//               <div className="flex items-center gap-3 flex-shrink-0">
//                 <div className="relative w-80">
//                   <svg
//                     className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                   <input
//                     type="text"
//                     placeholder="Search user, status, role...."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 bg-[#FFFEFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent"
//                   />
//                 </div>
//                 <button className="px-4 py-2 bg-[#FFFEFB] border border-gray-200 rounded-lg hover:bg-[#FFFAF5] flex items-center gap-2 whitespace-nowrap">
//                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
//                     />
//                   </svg>
//                   <span className="text-gray-600">Filter</span>
//                 </button>
//                 <button className="px-4 py-2 bg-[#FFFEFB] border border-gray-200 rounded-lg hover:bg-[#FFFAF5]">
//                   <span className="text-gray-600 text-xl">+</span>
//                 </button>
//               </div>
//             </div>

//             {/* User Table */}
//             <div className="overflow-x-auto -mx-6 px-6" data-aos="fade-up" data-aos-delay="150">
//               <div className="inline-block min-w-full align-middle">
//                 <div className="overflow-hidden">
//                   <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr className="bg-[#FFF9F5] border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Login</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map((user) => (
//                     <tr key={user.id} className="border-b border-gray-100 hover:bg-[#FFFEFB] bg-[#FFFAF5] border-l-4 border-l-[#C24438]">
//                       <td className="py-4 px-4">
//                         <div className="font-medium text-gray-900">{user.name}</div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="text-gray-600 text-sm">{user.email}</div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="text-gray-900">{user.role}</div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="text-gray-600">{user.location}</div>
//                       </td>
//                       <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
//                       <td className="py-4 px-4">
//                         <div className="text-gray-600 text-sm whitespace-pre-line">{user.lastLogin}</div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <button className="p-2 hover:bg-gray-100 rounded-full">
//                           <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
//                             <circle cx="12" cy="5" r="2" />
//                             <circle cx="12" cy="12" r="2" />
//                             <circle cx="12" cy="19" r="2" />
//                           </svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
