import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { certificationService } from '@/services/certificationService';
import { cloudinaryService } from '@/services/cloudinaryService';
import type { Certification } from '@/services/certificationService';

interface AssignCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: (certification: Certification) => void;
}

export const AssignCertificationModal: React.FC<AssignCertificationModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    certificationName: '',
    issuedDate: new Date().toISOString().split('T')[0],
    issuingBody: '',
    validityPeriod: '1 year',
    status: 'Valid',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!cloudinaryService.isValidFileType(file)) {
      setErrors(prev => ({
        ...prev,
        file: 'Please upload a valid file (JPG, PNG, GIF, or PDF)',
      }));
      return;
    }

    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        file: 'File size must be less than 10MB',
      }));
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, file: '' }));

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Show PDF icon for PDFs
      setFilePreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // Calculate the expiry date based on issue date and validity period
  const calculateExpiryDate = (issueDate: string, validityPeriod: string): Date => {
    const issDate = new Date(issueDate);
    const expDate = new Date(issDate);
    
    // Handle "lifetime" case - set to 100 years in the future
    if (validityPeriod.toLowerCase() === 'lifetime') {
      expDate.setFullYear(expDate.getFullYear() + 100);
      return expDate;
    }
    
    const periodValue = parseInt(validityPeriod.split(' ')[0]);
    const periodUnit = validityPeriod.split(' ')[1]?.toLowerCase() || '';
    
    if (periodUnit.includes('month')) {
      expDate.setMonth(expDate.getMonth() + periodValue);
    } else if (periodUnit.includes('year')) {
      expDate.setFullYear(expDate.getFullYear() + periodValue);
    }
    
    return expDate;
  };

  // Determine if a certificate is actually expired based on dates
  const isActuallyExpired = (issueDate: string, validityPeriod: string): boolean => {
    const expiryDate = calculateExpiryDate(issueDate, validityPeriod);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    return today > expiryDate;
  };

  // Get the correct status based on dates
  const getCorrectStatus = (issueDate: string, validityPeriod: string): 'Valid' | 'Expired' => {
    return isActuallyExpired(issueDate, validityPeriod) ? 'Expired' : 'Valid';
  };

  // Check if the selected status is valid based on dates
  const isStatusValid = (status: string, issueDate: string, validityPeriod: string): boolean => {
    const correctStatus = getCorrectStatus(issueDate, validityPeriod);
    return status === correctStatus;
  };

  const correctStatus = getCorrectStatus(formData.issuedDate, formData.validityPeriod);
  const statusMismatch = !isStatusValid(formData.status, formData.issuedDate, formData.validityPeriod);
  const expiryDate = calculateExpiryDate(formData.issuedDate, formData.validityPeriod);

  const issuingBodyOptions = [
    { value: '', label: 'Choose' },
    { value: 'OSHA', label: 'OSHA' },
    { value: 'NEBOSH', label: 'NEBOSH' },
    { value: 'ISO', label: 'ISO' },
    { value: 'HSE', label: 'HSE' },
    { value: 'IOSH', label: 'IOSH' },
    { value: 'INTERNAL', label: 'Internal Company' },
    { value: 'GOVERNMENT', label: 'Government Agency' },
    { value: 'OTHER', label: 'Other' },
  ];

  const validityPeriodOptions = [
    { value: '6 months', label: '6 months' },
    { value: '1 year', label: '1 year' },
    { value: '2 years', label: '2 years' },
    { value: '3 years', label: '3 years' },
    { value: '5 years', label: '5 years' },
    { value: 'lifetime', label: 'Lifetime' },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.certificationName.trim()) {
      newErrors.certificationName = 'Certification Name is required';
    }

    if (!formData.issuedDate) {
      newErrors.issuedDate = 'Issue Date is required';
    }

    if (!formData.issuingBody) {
      newErrors.issuingBody = 'Issuing Body is required';
    }

    // Validate status matches the expiry date
    if (statusMismatch) {
      newErrors.status = `Status must be "${correctStatus}" based on the issue date and validity period`;
    }

    return newErrors;
  };

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('📝 Validating form...');
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Form validation failed:', newErrors);
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    console.log('📝 Creating certification for user:', userId);

    try {
      let fileUrl: string | undefined = undefined;

      // Upload file to Cloudinary if selected
      if (selectedFile) {
        console.log(`📤 Uploading file: ${selectedFile.name}`);
        fileUrl = await cloudinaryService.uploadFile(selectedFile);
        console.log('✅ File uploaded successfully:', fileUrl);
      }

      // Calculate expiry date based on validity period
      const issueDate = new Date(formData.issuedDate);
      const expiryDate = new Date(issueDate);
      
      const periodValue = parseInt(formData.validityPeriod.split(' ')[0]);
      const periodUnit = formData.validityPeriod.split(' ')[1].toLowerCase();
      
      console.log(`📝 Period: ${periodValue} ${periodUnit}`);
      
      if (periodUnit.includes('month')) {
        expiryDate.setMonth(expiryDate.getMonth() + periodValue);
      } else if (periodUnit.includes('year')) {
        expiryDate.setFullYear(expiryDate.getFullYear() + periodValue);
      }
      // If lifetime, expiry date stays far in future (already set above)

      const expiryDateStr = expiryDate.toISOString().split('T')[0];

      console.log(`📝 Issue Date: ${formData.issuedDate}, Expiry Date: ${expiryDateStr}`);

      // Create certification via backend API
      const createdCert = await certificationService.createUserCertification(userId, {
        certificationName: formData.certificationName,
        issuingAuthority: formData.issuingBody,
        issueDate: formData.issuedDate,
        expiryDate: expiryDateStr,
        status: formData.status.toUpperCase(),
        fileUrl: fileUrl,
      });

      console.log('✅ Certification created successfully:', createdCert);
      setIsSubmitted(true);

      // Call onSuccess callback with the created certification
      if (onSuccess) {
        onSuccess(createdCert);
      }
    } catch (error: any) {
      console.error('❌ Failed to create certification:', error);
      showToast({
        type: 'error',
        message: error.message || 'Failed to assign certification',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      certificationName: '',
      issuedDate: new Date().toISOString().split('T')[0],
      issuingBody: '',
      validityPeriod: '1 year',
      status: 'Valid',
    });
    setSelectedFile(null);
    setFilePreview(null);
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[70] flex items-center justify-center transition-opacity duration-300 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 md:p-8 relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Certification</h2>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Certification Name and Issued Date - Side by side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Certification Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    value={formData.certificationName}
                    onChange={(e) => handleInputChange('certificationName', e.target.value)}
                    placeholder=""
                    className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.certificationName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#C24438] focus:border-transparent'
                    }`}
                  />
                  {errors.certificationName && (
                    <p className="mt-1 text-xs text-red-600">{errors.certificationName}</p>
                  )}
                </div>

                {/* Issued Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issuedDate}
                    onChange={(e) => handleInputChange('issuedDate', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
                      errors.issuedDate
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#C24438] focus:border-transparent'
                    }`}
                  />
                  {errors.issuedDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.issuedDate}</p>
                  )}
                </div>
              </div>

              {/* Issuing Body and Validity Period - Side by side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Issuing Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issuing Body
                  </label>
                  <select
                    value={formData.issuingBody}
                    onChange={(e) => handleInputChange('issuingBody', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-colors appearance-none bg-white cursor-pointer ${
                      errors.issuingBody
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#C24438] focus:border-transparent'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      paddingRight: '36px',
                    }}
                  >
                    {issuingBodyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.issuingBody && (
                    <p className="mt-1 text-xs text-red-600">{errors.issuingBody}</p>
                  )}
                </div>

                {/* Validity Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validity Period
                  </label>
                  <select
                    value={formData.validityPeriod}
                    onChange={(e) => handleInputChange('validityPeriod', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent appearance-none bg-white cursor-pointer transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      paddingRight: '36px',
                    }}
                  >
                    {validityPeriodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent appearance-none bg-white cursor-pointer transition-colors ${
                    statusMismatch ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  <option value="Valid">Valid</option>
                  <option value="Expired">Expired</option>
                </select>

                {/* Date Info and Warning */}
                <div className="mt-2 text-xs text-gray-600">
                  <p>Expiry Date: <span className="font-medium">{expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></p>
                </div>

                {statusMismatch && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-red-800">Status mismatch detected</p>
                      <p className="text-red-700 mt-1">Based on the expiry date, this certificate should be marked as <span className="font-semibold">{correctStatus}</span>.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Image/Document
                  <span className="text-gray-500 font-normal"> (Optional)</span>
                </label>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
                    dragActive
                      ? 'border-[#C24438] bg-red-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  } ${errors.file ? 'border-red-500 bg-red-50' : ''}`}
                >
                  <input
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="file-input"
                    accept="image/jpeg,image/png,image/gif,application/pdf"
                  />

                  {!selectedFile ? (
                    <label htmlFor="file-input" className="flex flex-col items-center justify-center cursor-pointer">
                      <svg
                        className={`w-10 h-10 mb-2 transition-colors ${
                          dragActive ? 'text-[#C24438]' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-700">
                        {dragActive ? 'Drop file here' : 'Drag and drop your file'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        or click to select
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        JPG, PNG, GIF or PDF (Max 10MB)
                      </p>
                    </label>
                  ) : (
                    <div className="flex items-start gap-4">
                      {/* File Preview */}
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded border border-gray-200 flex items-center justify-center bg-white">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* File Info */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {cloudinaryService.getFileTypeLabel(selectedFile)} •{' '}
                          {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                        </p>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview(null);
                          }}
                          className="text-xs text-[#C24438] hover:text-[#a03830] font-medium mt-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {errors.file && (
                  <p className="mt-1 text-xs text-red-600">{errors.file}</p>
                )}
              </div>
            </div>

            {/* Create Certification Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-8 py-3 bg-[#C24438] hover:bg-[#a03830] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Certification
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="flex flex-col items-center justify-center py-8">
              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Success Message */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification Assigned!</h3>
              <p className="text-center text-sm text-gray-600 mb-6">
                The certification has been successfully assigned to the user.
              </p>

              {/* Done Button */}
              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#C24438] hover:bg-[#a03830] text-white rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
