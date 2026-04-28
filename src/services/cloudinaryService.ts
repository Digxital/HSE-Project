/**
 * Cloudinary Upload Service
 * Handles direct file uploads to Cloudinary with no backend involvement
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn('⚠️ Cloudinary credentials not configured. File uploads will fail.');
  console.warn('Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env');
}

interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

export const cloudinaryService = {
  /**
   * Upload a file directly to Cloudinary
   * @param file - The file to upload
   * @returns Promise containing the secure URL of the uploaded file
   */
  async uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Validate file
        if (!file) {
          reject(new Error('No file provided'));
          return;
        }

        // Check file size (limit to 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          reject(new Error('File size exceeds 10MB limit'));
          return;
        }

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'certifications'); // Organize uploads in a folder

        console.log(`📤 Uploading file to Cloudinary: ${file.name}`);

        // Upload to Cloudinary
        fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data: CloudinaryUploadResponse) => {
            console.log('✅ File uploaded successfully to Cloudinary');
            console.log(`📎 Secure URL: ${data.secure_url}`);
            resolve(data.secure_url);
          })
          .catch((error) => {
            console.error('❌ Cloudinary upload failed:', error);
            reject(new Error(`Upload failed: ${error.message}`));
          });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ File upload error: ${errorMessage}`);
        reject(error);
      }
    });
  },

  /**
   * Validate if a file is an acceptable format for certification
   * @param file - File to validate
   * @returns true if file is valid
   */
  isValidFileType(file: File): boolean {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ];
    return validTypes.includes(file.type);
  },

  /**
   * Get a user-friendly name for the file type
   * @param file - File to get type name for
   * @returns String describing the file type
   */
  getFileTypeLabel(file: File): string {
    const typeMap: { [key: string]: string } = {
      'image/jpeg': 'JPEG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'application/pdf': 'PDF Document',
    };
    return typeMap[file.type] || 'File';
  },
};
