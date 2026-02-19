import { useState, useEffect } from 'react';
import { getUserData, type UserData } from '@/utils/authStorage';

export const useUser = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from storage
    const userData = getUserData();
    setUser(userData);
  }, []);

  return {
    user,
    userName: user?.name || 'User',
    userRole: user?.role || 'Guest',
    userEmail: user?.email || '',
  };
};