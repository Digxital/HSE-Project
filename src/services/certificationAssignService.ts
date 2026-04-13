import axios from 'axios';

export interface AssignCertificationPayload {
  name: string;
  issuedDate: string;
  issuingBody: string;
  validityPeriod: string;
  status?: 'Active' | 'Valid' | 'Expired';
  expiryDate?: string;
}

export interface UserCertification extends AssignCertificationPayload {
  id?: string;
  _id?: string;
  status?: 'Active' | 'Valid' | 'Expired';
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignCertificationResponse {
  success: boolean;
  message: string;
  data?: UserCertification;
}

const STORAGE_KEY_PREFIX = 'aegix_user_certifications_';

class CertificationAssignService {
  /**
   * Assign a certification to a user
   * Posts to backend API and saves to localStorage
   */
  async assignCertificationToUser(
    userId: string,
    payload: AssignCertificationPayload
  ): Promise<UserCertification> {
    try {
      console.log('📋 Assigning certification to user:', userId);
      console.log('📋 Payload:', payload);

      // Prepare dates
      const issueDate = payload.issuedDate; // Use the date provided by user
      
      // Calculate expiry date based on validity period
      let expiryDate = payload.expiryDate;
      if (!expiryDate) {
        const expiry = new Date(issueDate);
        const periodValue = parseInt(payload.validityPeriod.split(' ')[0]);
        const periodUnit = payload.validityPeriod.split(' ')[1];

        if (periodUnit.includes('month')) {
          expiry.setMonth(expiry.getMonth() + periodValue);
        } else if (periodUnit.includes('year')) {
          expiry.setFullYear(expiry.getFullYear() + periodValue);
        } else if (periodUnit.includes('lifetime')) {
          expiry.setFullYear(expiry.getFullYear() + 100); // 100 years = lifetime
        }
        
        expiryDate = expiry.toISOString().split('T')[0];
      }

      console.log('📋 Calculated dates - Issue:', issueDate, 'Expiry:', expiryDate);

      // Prepare data for backend
      const backendPayload = {
        name: payload.name,
        issuingBody: payload.issuingBody,
        validityPeriod: payload.validityPeriod,
        issueDate,
        expiryDate,
        status: payload.status || 'Active',
      };

      console.log('📋 Sending to backend:', backendPayload);

      // POST to backend
      const response = await axios.post<AssignCertificationResponse>(
        `/api/users/${userId}/certifications`,
        backendPayload
      );

      if (response.data.success && response.data.data) {
        console.log('✅ Certification assigned successfully:', response.data.data);

        // Create certification object for storage
        const certification: UserCertification = {
          ...response.data.data,
          id: response.data.data._id || response.data.data.id || Date.now().toString(),
          expiryDate: response.data.data.expiryDate || expiryDate,
          status: this.calculateStatus(response.data.data.expiryDate || expiryDate),
        };

        // Save to localStorage
        this.saveCertificationToStorage(userId, certification);
        console.log('💾 Saved to localStorage');

        return certification;
      } else {
        throw new Error(response.data.message || 'Failed to assign certification');
      }
    } catch (error: any) {
      console.error('❌ Error assigning certification:', error);

      // Check specific error types
      if (error.response?.status === 401) {
        console.error('🔒 Unauthorized - user not authenticated');
        throw new Error('You are not authorized to perform this action. Please login again.');
      } else if (error.response?.status === 404) {
        console.error('❌ User not found');
        throw new Error('User not found. Please refresh and try again.');
      } else if (error.response?.status === 400) {
        console.error('❌ Bad request:', error.response.data?.message);
        throw new Error(
          error.response.data?.message || 'Invalid certification data. Please check your inputs.'
        );
      } else if (error.response?.status === 500) {
        console.error('❌ Server error');
        throw new Error('Server error. Please try again later.');
      } else if (error.message === 'Network Error') {
        console.error('⚠️ Network error - offline mode');
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(
          error.response?.data?.message || error.message || 'Failed to assign certification'
        );
      }
    }
  }

  /**
   * Fetch all certifications for a user from backend
   */
  async fetchUserCertifications(userId: string): Promise<UserCertification[]> {
    try {
      console.log('📋 Fetching certifications for user:', userId);

      const response = await axios.get<{
        success: boolean;
        message: string;
        data: any[];
      }>(`/api/users/${userId}/certifications`);

      if (response.data.success && Array.isArray(response.data.data)) {
        console.log('✅ Fetched certifications from backend:', response.data.data);

        // Map backend response to frontend format
        const mappedCertifications = response.data.data.map((cert: any) => ({
          id: cert.certificationId || cert._id || cert.id,
          _id: cert.certificationId || cert._id || cert.id,
          name: cert.certificationName || cert.name,
          description: cert.description || '',
          issuingBody: cert.issuingAuthority || cert.issuingBody,
          validityPeriod: cert.validityPeriod || '',
          issueDate: cert.issueDate || cert.issuedDate,
          issuedDate: cert.issueDate || cert.issuedDate,
          expiryDate: cert.expiryDate,
          status: (cert.status as 'Active' | 'Valid' | 'Expired') || this.calculateStatus(cert.expiryDate),
          fileUrl: cert.fileUrl,
          createdAt: cert.createdAt,
          updatedAt: cert.updatedAt,
        })) as UserCertification[];

        console.log('📊 Mapped certifications:', mappedCertifications);

        this.saveCertificationsToStorage(userId, mappedCertifications);
        console.log('💾 Saved to localStorage');

        return mappedCertifications;
      } else {
        console.log('📋 No certifications found');
        return [];
      }
    } catch (error: any) {
      console.error('❌ Error fetching certifications:', error);

      // Try to get from localStorage as fallback
      const cached = this.getCertificationsFromStorage(userId);
      if (cached.length > 0) {
        console.log('⚠️ Using cached certifications from localStorage');
        return cached;
      }

      // Check specific error types
      if (error.response?.status === 401) {
        console.error('🔒 Unauthorized - user not authenticated');
        throw new Error('You are not authorized to view certifications. Please login again.');
      } else if (error.response?.status === 404) {
        console.log('📋 No certifications found for this user');
        return [];
      } else if (error.message === 'Network Error') {
        console.error('⚠️ Network error - offline mode');
        return [];
      }

      // Return empty array instead of throwing for non-critical errors
      console.warn('⚠️ Could not fetch certifications, returning empty array');
      return [];
    }
  }

  /**
   * Save certification to localStorage
   */
  private saveCertificationToStorage(userId: string, certification: UserCertification): void {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      const existing = this.getCertificationsFromStorage(userId);

      // Check if certification already exists (by id or name)
      const filtered = existing.filter(
        cert => cert.id !== certification.id && cert.name !== certification.name
      );

      const updated = [...filtered, certification];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      console.log('💾 Certification saved to localStorage:', storageKey);
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      // Don't throw - localStorage failure shouldn't break the app
    }
  }

  /**
   * Save multiple certifications to localStorage
   */
  private saveCertificationsToStorage(
    userId: string,
    certifications: UserCertification[]
  ): void {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(certifications));
      console.log('💾 Certifications saved to localStorage:', storageKey);
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      // Don't throw - localStorage failure shouldn't break the app
    }
  }

  /**
   * Get certifications from localStorage
   */
  getCertificationsFromStorage(userId: string): UserCertification[] {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      const data = localStorage.getItem(storageKey);

      if (!data) {
        console.log('📋 No cached certifications found');
        return [];
      }

      const certifications = JSON.parse(data) as UserCertification[];
      // Recalculate status on retrieval in case dates changed
      return certifications.map(cert => ({
        ...cert,
        status: this.calculateStatus(cert.expiryDate || ''),
      }));
    } catch (error) {
      console.error('❌ Error reading from localStorage:', error);
      return [];
    }
  }

  /**
   * Calculate expiry date based on issue date and validity period
   */
  calculateExpiryDate(issueDate: string, validityPeriod: string): string {
    try {
      const expiry = new Date(issueDate);
      const periodValue = parseInt(validityPeriod.split(' ')[0]);
      const periodUnit = validityPeriod.split(' ')[1];

      if (periodUnit.includes('month')) {
        expiry.setMonth(expiry.getMonth() + periodValue);
      } else if (periodUnit.includes('year')) {
        expiry.setFullYear(expiry.getFullYear() + periodValue);
      } else if (periodUnit.includes('lifetime')) {
        expiry.setFullYear(expiry.getFullYear() + 100); // 100 years = lifetime
      }
      
      return expiry.toISOString().split('T')[0];
    } catch (error) {
      console.error('❌ Error calculating expiry date:', error);
      return issueDate;
    }
  }

  /**
   * Calculate certification status based on expiry date
   */
  private calculateStatus(expiryDate: string): 'Active' | 'Valid' | 'Expired' {
    if (!expiryDate) return 'Active';

    try {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      console.log(`📊 Days until expiry: ${daysUntilExpiry}`);

      if (daysUntilExpiry < 0) {
        return 'Expired';
      } else if (daysUntilExpiry < 30) {
        return 'Valid'; // Warning - expiring soon
      } else {
        return 'Active';
      }
    } catch (error) {
      console.error('❌ Error calculating status:', error);
      return 'Active';
    }
  }

  /**
   * Delete certification from user
   */
  async deleteCertification(userId: string, certificationId: string): Promise<void> {
    try {
      console.log('📋 Deleting certification:', certificationId);

      await axios.delete(`/api/users/${userId}/certifications/${certificationId}`);

      console.log('✅ Certification deleted successfully');

      // Remove from localStorage
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      const existing = this.getCertificationsFromStorage(userId);
      const filtered = existing.filter(
        cert => cert.id !== certificationId && cert._id !== certificationId
      );
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      console.log('💾 Removed from localStorage');
    } catch (error: any) {
      console.error('❌ Error deleting certification:', error);

      if (error.response?.status === 401) {
        throw new Error('You are not authorized to delete certifications.');
      } else if (error.response?.status === 404) {
        throw new Error('Certification not found.');
      }

      throw new Error(error.response?.data?.message || 'Failed to delete certification');
    }
  }

  /**
   * Clear all cached certifications for a user
   */
  clearStorageForUser(userId: string): void {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      localStorage.removeItem(storageKey);
      console.log('🗑️ Cleared cached certifications for user:', userId);
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
    }
  }
}

export const certificationAssignService = new CertificationAssignService();
