import { Client } from '@microsoft/microsoft-graph-client';
import { getAuthToken } from '@/utils/authStorage';

export interface MicrosoftUserData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department?: string;
  usageLocation?: string;
}

export interface MicrosoftSku {
  skuId: string;
  skuPartNumber: string;
  consumedUnits: number;
  prepaidUnits: {
    enabled: number;
    suspended: number;
    warning: number;
  };
}

class Microsoft365Service {
  private graphClient: Client | null = null;
  private accessToken: string | null = null;
 
  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      const token = await this.getMicrosoftToken();
      if (token) {
        this.accessToken = token;
        this.graphClient = Client.init({
          authProvider: (done) => {
            done(null, this.accessToken);
          },
        });
      }
    } catch (error) {
      console.error('Failed to initialize Microsoft Graph client:', error);
    }
  }

  private async getMicrosoftToken(): Promise<string | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await fetch('/api/microsoft/token', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error('Error getting Microsoft token:', error);
      return null;
    }
  }

  // ✅ ADD THIS METHOD - Get available SKUs/licenses
  async getAvailableSkus(): Promise<MicrosoftSku[]> {
    try {
      if (!this.graphClient) {
        await this.initializeClient();
      }

      if (!this.graphClient) {
        throw new Error('Microsoft Graph client not initialized');
      }

      const response = await this.graphClient.api('/subscribedSkus').get();
      console.log('Available SKUs:', response.value);
      return response.value;
    } catch (error) {
      console.error('Error fetching SKUs:', error);
      return [];
    }
  }

  async createMicrosoftUser(userData: MicrosoftUserData): Promise<any> {
    try {
      if (!this.graphClient) {
        await this.initializeClient();
      }

      if (!this.graphClient) {
        throw new Error('Microsoft Graph client not initialized');
      }

      const password = this.generateRandomPassword();

      const user = await this.graphClient.api('/users').post({
        accountEnabled: true,
        displayName: `${userData.firstName} ${userData.lastName}`,
        mailNickname: userData.email.split('@')[0],
        userPrincipalName: userData.email,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: password,
        },
        jobTitle: userData.jobTitle,
        department: userData.department || 'General',
        usageLocation: userData.usageLocation || 'US',
        givenName: userData.firstName,
        surname: userData.lastName,
      });

      // Store the password temporarily to send via email
      (user as any).temporaryPassword = password;
      
      return user;
    } catch (error) {
      console.error('Error creating Microsoft 365 user:', error);
      throw error;
    }
  }

  async assignLicense(userId: string, skuId: string): Promise<void> {
    try {
      if (!this.graphClient) {
        await this.initializeClient();
      }

      console.log(`Assigning license ${skuId} to user ${userId}`);
      
      await this.graphClient?.api(`/users/${userId}/assignLicense`).post({
        addLicenses: [
          {
            disabledPlans: [],
            skuId: skuId,
          },
        ],
        removeLicenses: [],
      });
      
      console.log('License assigned successfully');
    } catch (error) {
      console.error('Error assigning license:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, temporaryPassword: string): Promise<void> {
    try {
      if (!this.graphClient) {
        await this.initializeClient();
      }

      const emailContent = {
        message: {
          subject: 'Welcome to Microsoft 365',
          body: {
            contentType: 'HTML',
            content: `
              <h1>Welcome to Microsoft 365!</h1>
              <p>Your account has been created successfully.</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
              <p>You will be required to change this password on first login.</p>
              <p>Login at: <a href="https://login.microsoftonline.com">https://login.microsoftonline.com</a></p>
              <hr>
              <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply.</p>
            `,
          },
          toRecipients: [
            {
              emailAddress: {
                address: email,
              },
            },
          ],
        },
      };

      await this.graphClient?.api('/users/me/sendMail').post(emailContent);
      console.log('Welcome email sent to:', email);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  private generateRandomPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    // Ensure password meets complexity requirements
    password += 'Aa1!';
    return password;
  }
}

export const microsoft365Service = new Microsoft365Service();