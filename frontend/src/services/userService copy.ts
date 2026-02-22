import api from '@/lib/axios';
import { getAuthToken } from '@/utils/authStorage';

export interface CreateUserData {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jobPosition: string;
  createMicrosoftAccount?: boolean;
  password?: string;
}

export interface UserResponse {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jobPosition: string;
  createdAt: string;
  lastLogin: string;
  tenantId?: string;
  updatedAt?: string;
  status: 'active' | 'pending' | 'inactive';
  microsoftUserId?: string;
  microsoftAccountStatus?: 'created' | 'pending' | 'failed';
}
 
export const userService = {
  async createUser(userData: CreateUserData): Promise<UserResponse & { temporaryPassword?: string; microsoftWarning?: string }> {
    try {
      // Get token
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('📝 Creating user with data:', userData);
       
      // Generate a random password if not provided
      const password = userData.password || generateRandomPassword();
      
      const payload = {
        // firstName: userData.firstName,
        // lastName: userData.lastName,
        // email: userData.email,
        // jobTitle: userData.jobPosition,
        // // password: password,
        // password: "Password123",
        // status: 'active',
        // role: userData.role.toUpperCase(),
        firstName: "John",
        lastName: "Doe",
        email: "john12x3@aegix.com",
        password: "Password123",
        role: "FIELD_USER"
      };
 
      // STEP 1: Create user in local database
      console.log('📝 Creating local user...');
      const response = await api.post('/api/admin/users', payload); 
       
      console.log('✅ Local user created:', response.data);
      
      // Extract user ID from response (adjust based on your API response structure)
      const localUser = response.data.user || response.data;
      const userId = localUser.id || localUser._id;

      // STEP 2: Create Microsoft account if requested
      let microsoftResult = null;
      if (userData.createMicrosoftAccount) {
        try { 
          console.log('🔄 Creating Microsoft 365 account for:', userData.email);
          
          // Call your Microsoft users endpoint
          const microsoftResponse = await api.post('/api/microsoft/users', {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            jobTitle: userData.jobPosition,
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('✅ Microsoft account created:', microsoftResponse.data);
          microsoftResult = microsoftResponse.data;

          // STEP 3: Update local user with Microsoft info
          if (userId) {
            try {
              await api.patch(`/api/admin/users/${userId}`, {
                microsoftUserId: microsoftResponse.data.id,
                microsoftAccountStatus: 'created',
              }, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              console.log('✅ Local user updated with Microsoft info');
            } catch (updateError) {
              console.warn('⚠️ Could not update local user with Microsoft info:', updateError);
            }
          }

        } catch (microsoftError: any) {
          console.error('❌ Failed to create Microsoft account:', microsoftError.response?.data || microsoftError.message);
          
          // Update local user with failure status
          if (userId) {
            try {
              await api.patch(`/api/admin/users/${userId}`, {
                microsoftAccountStatus: 'failed',
              }, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
            } catch (updateError) {
              console.warn('⚠️ Could not update failure status:', updateError);
            }
          }
          
          // Return local user with warning
          return {
            ...localUser,
            microsoftAccountStatus: 'failed',
            microsoftWarning: microsoftError.response?.data?.message || 'Microsoft account creation failed'
          };
        }
      }
      
      // Return combined result
      return {
        ...localUser,
        ...(microsoftResult && {
          microsoftUserId: microsoftResult.id,
          microsoftAccountStatus: 'created',
          temporaryPassword: microsoftResult.temporaryPassword // For admin to share
        })
      };
      
    } catch (error: any) {
      console.error('❌ Error creating user:', error);
      
      // Handle specific status codes
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to create users. Admin access required.');
      } else if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('User creation endpoint not found. Please check API configuration.');
      } else if (error.response?.status === 409) {
        throw new Error('A user with this email already exists.');
      }
      
      throw error;
    } 
  },

  async getUsers(): Promise<UserResponse[]> {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await api.get('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      // Extract data from the wrapped response
      const usersData = response.data.data || response.data;
      
      // Ensure we return an array
      return Array.isArray(usersData) ? usersData : [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      await api.delete(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<CreateUserData & { status?: string }>): Promise<UserResponse> {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await api.patch(`/api/admin/users/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

 
};

// Helper function to generate random password
function generateRandomPassword(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}