export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    role: string;
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      tenantId?: string;
    };
  };
}

type UserStatus = 'Active' | 'Deactivated' | 'Pending';
export interface User {
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