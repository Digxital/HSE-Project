import api from '@/lib/axios';
import { getAuthToken } from '@/utils/authStorage';
import { microsoft365Service } from './microsoft365Service';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jobPosition: string;
  createMicrosoftAccount?: boolean;
  assignLicense?: boolean;
  licenseSkuId?: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jobPosition: string;
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'pending' | 'inactive';
  microsoftUserId?: string; 
  microsoftAccountStatus?: 'created' | 'pending' | 'failed';
}

// Microsoft 365 SKU IDs (common ones)
export const MICROSOFT_SKUS = {
  BUSINESS_BASIC: '3b555118-d6b3-4f1d-8d52-8f455c3035c1', // Microsoft 365 Business Basic
  BUSINESS_STANDARD: 'c7df2760-2c81-4ef7-b578-5b5392b571df', // Microsoft 365 Business Standard
  BUSINESS_PREMIUM: 'f245ecc8-75af-4f8e-b61f-27d8114de5f3', // Microsoft 365 Business Premium
  ENTERPRISE_E3: '6fd2c87f-b296-42f0-b197-1e91e994b900', // Microsoft 365 E3
  ENTERPRISE_E5: 'c7df2760-2c81-4ef7-b578-5b5392b571df', // Microsoft 365 E5
};

export const userService = {
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    try {
      // Get token
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('📝 Creating user with data:', userData);
      
      const payload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        jobTitle: userData.jobPosition,
        password: "Password123", // This should be generated or handled differently in production
        status: 'pending',
        invitedAt: new Date().toISOString(),
        role: userData.role.toUpperCase(),
        createMicrosoftAccount: userData.createMicrosoftAccount || false,
      };

      // Create user in local database
      const response = await api.post('/api/admin/users', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Local user created:', response.data);
      const localUser = response.data;

      // If Microsoft 365 account creation is requested
      if (userData.createMicrosoftAccount) {
        try {
          console.log('🔄 Creating Microsoft 365 account for:', userData.email);
          
          // Create Microsoft 365 account
          const microsoftUser = await microsoft365Service.createMicrosoftUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            jobTitle: userData.jobPosition,
          });

          console.log('✅ Microsoft 365 account created:', microsoftUser);

          // Assign license if requested
          if (userData.assignLicense && userData.licenseSkuId) {
            try {
              await microsoft365Service.assignLicense(microsoftUser.id, userData.licenseSkuId);
              console.log('✅ License assigned successfully');
            } catch (licenseError) {
              console.error('❌ Failed to assign license:', licenseError);
            }
          }

          // Send welcome email
          try {
            await microsoft365Service.sendWelcomeEmail(userData.email, 'Welcome to Microsoft 365');
            console.log('✅ Welcome email sent');
          } catch (emailError) {
            console.error('❌ Failed to send welcome email:', emailError);
          }

          // Update local user with Microsoft info
          try {
            const updateResponse = await api.patch(`/api/admin/users/${localUser.id}`, {
              microsoftUserId: microsoftUser.id,
              microsoftAccountStatus: 'created',
            });
            
            console.log('✅ Local user updated with Microsoft info:', updateResponse.data);
            
            // Update the localUser object with Microsoft data
            localUser.microsoftUserId = microsoftUser.id;
            localUser.microsoftAccountStatus = 'created';
          } catch (updateError) {
            console.error('❌ Failed to update local user with Microsoft info:', updateError);
          }

        } catch (microsoftError: any) {
          console.error('❌ Failed to create Microsoft 365 account:', microsoftError);
          
          // Update local user with failure status
          try {
            await api.patch(`/api/admin/users/${localUser.id}`, {
              microsoftAccountStatus: 'failed',
            });
          } catch (updateError) {
            console.error('❌ Failed to update failure status:', updateError);
          }
          
          localUser.microsoftAccountStatus = 'failed';
          
          // Re-throw with user-friendly message
          throw new Error(`Microsoft 365 account creation failed: ${microsoftError.message}`);
        }
      }
      
      return localUser; // Return the updated user with Microsoft info
      
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

      const response = await api.get('/api/admin/users');
      return response.data;
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

  async resendInvitation(userId: string): Promise<void> {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      await api.post(`/api/admin/users/${userId}/resend-invitation`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      throw error;
    }
  },

  async syncWithMicrosoft(userId: string): Promise<UserResponse> {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await api.post(`/api/admin/users/${userId}/sync-microsoft`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error syncing with Microsoft:', error);
      throw error;
    }
  }
};