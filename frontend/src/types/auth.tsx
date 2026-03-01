export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}


export interface User {
  id: string;
  microsoftId?: string; // Microsoft's user ID
  email: string;
  firstName: string;
  lastName: string;
  role?: string; // Assigned in your platform
  jobPosition?: string;
  status: 'pending' | 'active' | 'inactive'; // pending = needs role assignment
  source: 'microsoft-365' | 'manual'; // Where user came from
  createdAt: string;
  syncedAt?: string; // Last sync with Microsoft
}