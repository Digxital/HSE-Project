// components/MicrosoftUserImport.tsx
import React, { useState } from 'react';
import { microsoft365Service } from '@/services/microsoft365Service'; // ✅ Fix: use correct import name
import { userService } from '@/services/userService';

interface MicrosoftUser {
  id: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  mail?: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
}

export const MicrosoftUserImport: React.FC = () => {
  const [microsoftUsers, setMicrosoftUsers] = useState<MicrosoftUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<MicrosoftUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMicrosoftUsers = async () => {
    setLoading(true);
    try {
      const users = await microsoft365Service.getUsers(); // ✅ Using the existing method
      setMicrosoftUsers(users);
    } catch (error) {
      console.error('Error fetching Microsoft users:', error);
    } finally {
      setLoading(false);
    }
  };

  const importSelectedUsers = async () => {
    // This will be implemented when you add the backend endpoint
    console.log('Importing users:', selectedUsers);
  };

  return (
    <div className="p-4">
      <h2>Import Microsoft 365 Users</h2>
      <button onClick={fetchMicrosoftUsers} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Users'}
      </button>
      
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {microsoftUsers.map(user => (
            <tr key={user.id}>
              <td>
                <input 
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
                    }
                  }}
                />
              </td>
              <td>{user.displayName}</td>
              <td>{user.mail || user.userPrincipalName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={importSelectedUsers}>
        Import Selected ({selectedUsers.length})
      </button>
    </div>
  );
};