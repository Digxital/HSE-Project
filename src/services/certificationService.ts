import api from '@/lib/axios';

// API Response Types
export interface ApiCertification {
  certificationId: string;
  referenceId: string;
  userId: string;
  certificationName: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  fileUrl: string;
  status: 'VALID' | 'EXPIRED';
  createdBy: string;
  createdAt: string;
}

export interface ApiCertificationResponse {
  success: boolean;
  message: string;
  data: ApiCertification[];
}

// Frontend Display Type
export interface Certification {
  id: string;
  referenceId: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  fileUrl: string;
  status: 'Active' | 'Valid' | 'Expired';
  createdAt: string;
}

export const certificationService = {
  /**
   * Fetch all certifications for admin overview (all users)
   * @returns Array of all certifications across all users
   */
  async getAllCertifications(): Promise<Certification[]> {
    try {
      console.log(`📋 Fetching all certifications for admin overview`);
      
      const response = await api.get<ApiCertificationResponse>(
        `/api/admin/certifications`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch admin certifications');
      }

      console.log(`✅ Fetched ${response.data.data.length} certifications from admin endpoint`);

      // Map API response to frontend format
      const certs = response.data.data.map((cert) => mapApiCertToCertification(cert));
      
      // Log status breakdown
      const activeCount = certs.filter(c => c.status === 'Active').length;
      const validCount = certs.filter(c => c.status === 'Valid').length;
      const expiredCount = certs.filter(c => c.status === 'Expired').length;
      console.log(`📊 Breakdown - Active: ${activeCount}, Valid: ${validCount}, Expired: ${expiredCount}`);
      
      return certs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to fetch admin certifications: ${errorMessage}`, error);
      throw error;
    }
  },

  /**
   * Fetch certifications for a specific user
   * @param userId - The user ID to fetch certifications for
   * @returns Array of certifications
   */
  async getUserCertifications(userId: string): Promise<Certification[]> {
    try {
      console.log(`📋 Fetching certifications for user: ${userId}`);
      
      const response = await api.get<ApiCertificationResponse>(
        `/api/users/${userId}/certifications`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch certifications');
      }

      console.log(`✅ Fetched ${response.data.data.length} certifications successfully`);

      // Map API response to frontend format
      const certs = response.data.data.map((cert) => mapApiCertToCertification(cert));
      
      // Log status breakdown
      const activeCount = certs.filter(c => c.status === 'Active').length;
      const validCount = certs.filter(c => c.status === 'Valid').length;
      const expiredCount = certs.filter(c => c.status === 'Expired').length;
      console.log(`📊 Breakdown - Active: ${activeCount}, Valid: ${validCount}, Expired: ${expiredCount}`);
      
      return certs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to fetch user certifications: ${errorMessage}`, error);
      throw error;
    }
  },
};

/**
 * Map API certification to frontend format
 */
function mapApiCertToCertification(apiCert: ApiCertification): Certification {
  try {
    const today = new Date();
    const expiryDate = new Date(apiCert.expiryDate);
    
    // Validate expiry date
    if (isNaN(expiryDate.getTime())) {
      console.warn(`⚠️ Invalid expiry date for cert ${apiCert.certificationId}: ${apiCert.expiryDate}`);
    }

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Determine status based on expiry date
    let displayStatus: 'Active' | 'Valid' | 'Expired';
    if (expiryDate < today) {
      displayStatus = 'Expired';
    } else if (expiryDate < thirtyDaysFromNow) {
      displayStatus = 'Valid'; // Expiring soon
    } else {
      displayStatus = 'Active';
    }

    return {
      id: apiCert.certificationId,
      referenceId: apiCert.referenceId,
      name: apiCert.certificationName,
      issuedBy: apiCert.issuingAuthority,
      issueDate: formatDate(apiCert.issueDate),
      expiryDate: formatDate(apiCert.expiryDate),
      fileUrl: apiCert.fileUrl,
      status: displayStatus,
      createdAt: apiCert.createdAt,
    };
  } catch (err) {
    console.error(`❌ Error mapping certification ${apiCert.certificationId}:`, err);
    throw err;
  }
}

/**
 * Format date string to readable format
 */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr; // Fallback to original string if parsing fails
  }
}
