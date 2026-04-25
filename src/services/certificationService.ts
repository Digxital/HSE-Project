import api from '@/lib/axios';

// API Response Types
export interface ApiCertification {
  _id: string;
  certificationId?: string;
  referralId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  certificationName: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  fileUrl?: string;
  status: 'VALID' | 'EXPIRED';
  createdBy?: string;
  createdAt: string;
}

export interface ApiCertificationResponse {
  success: boolean;
  message: string;
  data: ApiCertification | ApiCertification[];
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
  status: 'Valid' | 'Expired';
  createdAt: string;
  userEmail?: string; // Email of the user assigned this certification
  userId?: string; // ID of the user assigned this certification
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

      // Handle both single object and array responses
      const dataArray = Array.isArray(response.data.data) 
        ? response.data.data 
        : [response.data.data];

      console.log(`✅ Fetched ${dataArray.length} certifications from admin endpoint`);

      // Map API response to frontend format
      const certs = dataArray.map((cert) => mapApiCertToCertification(cert));
      
      // Log status breakdown
      const validCount = certs.filter((c) => c.status === 'Valid').length;
      const expiredCount = certs.filter((c) => c.status === 'Expired').length;
      console.log(`📊 Breakdown - Valid: ${validCount}, Expired: ${expiredCount}`);
      
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

      // Handle both single object and array responses
      const dataArray = Array.isArray(response.data.data) 
        ? response.data.data 
        : [response.data.data];

      console.log(`✅ Fetched ${dataArray.length} certifications successfully`);

      // Map API response to frontend format
      const certs = dataArray.map((cert) => mapApiCertToCertification(cert));
      
      // Log status breakdown
      const validCount = certs.filter((c) => c.status === 'Valid').length;
      const expiredCount = certs.filter((c) => c.status === 'Expired').length;
      console.log(`📊 Breakdown - Valid: ${validCount}, Expired: ${expiredCount}`);
      
      return certs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to fetch user certifications: ${errorMessage}`, error);
      throw error;
    }
  },

  /**
   * Create a certification for a user
   * @param userId - The user ID to assign certification to
   * @param payload - The certification data
   * @returns The created certification
   */
  async createUserCertification(
    userId: string,
    payload: {
      certificationName: string;
      issuingAuthority: string;
      issueDate: string;
      expiryDate: string;
      status?: string;
      fileUrl?: string;
    }
  ): Promise<Certification> {
    try {
      console.log(`📝 Creating certification for user: ${userId}`);
      console.log(`📝 Full Payload:`, JSON.stringify(payload, null, 2));
      
      const response = await api.post<ApiCertificationResponse>(
        `/api/admin/users/${userId}/certifications`,
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to create certification');
      }

      console.log(`✅ Certification created successfully`);
      console.log(`✅ Response:`, response.data);
      
      // Handle both single object and array responses
      const apiCert = Array.isArray(response.data.data) 
        ? response.data.data[0] 
        : response.data.data;
      
      // Map response to frontend format
      const cert = mapApiCertToCertification(apiCert);
      console.log(`✅ Mapped certification:`, cert);
      
      return cert;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to create certification: ${errorMessage}`, error);
      if (error instanceof Error && 'response' in error) {
        console.error(`❌ Backend error response:`, (error as any).response?.data);
      }
      throw error;
    }
  },
};

/**
 * Map API certification to frontend format
 */
function mapApiCertToCertification(apiCert: ApiCertification): Certification {
  try {
    const expiryDate = new Date(apiCert.expiryDate);
    
    // Validate expiry date
    if (isNaN(expiryDate.getTime())) {
      console.warn(`⚠️ Invalid expiry date for cert ${apiCert._id}: ${apiCert.expiryDate}`);
    }

    // Determine status based on API response (VALID or EXPIRED)
    let displayStatus: 'Valid' | 'Expired';
    if (apiCert.status === 'EXPIRED') {
      displayStatus = 'Expired';
    } else {
      displayStatus = 'Valid'; // Default to Valid if not explicitly expired
    }

    // Extract email and userId from nested userId object
    const userEmail = typeof apiCert.userId === 'object' && apiCert.userId
      ? apiCert.userId.email 
      : '';
    
    const userId = typeof apiCert.userId === 'object' && apiCert.userId
      ? apiCert.userId._id 
      : '';

    return {
      id: apiCert._id || apiCert.certificationId || '',
      referenceId: apiCert.referralId,
      name: apiCert.certificationName,
      issuedBy: apiCert.issuingAuthority,
      issueDate: formatDate(apiCert.issueDate),
      expiryDate: formatDate(apiCert.expiryDate),
      fileUrl: apiCert.fileUrl || '',
      status: displayStatus,
      createdAt: apiCert.createdAt,
      userEmail: userEmail,
      userId: userId,
    };
  } catch (err) {
    console.error(`❌ Error mapping certification ${apiCert._id}:`, err);
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
