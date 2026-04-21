import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { certificationAssignService } from '@/services/certificationAssignService';
import type { UserCertification } from '@/services/certificationAssignService';

interface AssignCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  onSuccess?: (certification: UserCertification) => void;
}

export const AssignCertificationModal: React.FC<AssignCertificationModalProps> = ({
  isOpen,
  onClose,
  userId,
  userEmail,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    certificationName: '',
    issuedDate: new Date().toISOString().split('T')[0],
    issuingBody: '',
    validityPeriod: '1 year',
    status: 'Active',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

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
      // Calculate expiry date
      const expiryDate = certificationAssignService.calculateExpiryDate(
        formData.issuedDate,
        formData.validityPeriod
      );

      // Create certification object
      const createdCert: UserCertification = {
        id: Date.now().toString(), // Temporary ID
        name: formData.certificationName,
        issuedDate: formData.issuedDate,
        issuingBody: formData.issuingBody,
        validityPeriod: formData.validityPeriod,
        status: formData.status as 'Active' | 'Valid' | 'Expired',
        expiryDate,
      };

      console.log('📦 Created certification object:', createdCert);

      // Save to user-specific localStorage
      const storageKey = `aegix_user_certifications_${userId}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]') as UserCertification[];
      const updated = [...existing, createdCert];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      console.log('💾 Saved to user-specific localStorage:', storageKey);

      // Also save to master certifications list
      const masterKey = 'aegix_all_certifications';
      const masterList = JSON.parse(localStorage.getItem(masterKey) || '[]') as Array<UserCertification & { userId: string; userEmail: string }>;
      const certWithUserInfo = { ...createdCert, userId, userEmail };
      console.log('🔍 Cert with user info being saved:', { certWithUserInfo, userId, userEmail });
      const masterUpdated = [...masterList, certWithUserInfo];
      localStorage.setItem(masterKey, JSON.stringify(masterUpdated));
      console.log('💾 Saved to master certifications list:', masterKey);

      console.log('✅ Certification created successfully');
      setIsSubmitted(true);
      showToast({
        type: 'success',
        message: 'Certification assigned successfully',
      });

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
      status: 'Active',
    });
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent appearance-none bg-white cursor-pointer transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Valid">Valid</option>
                  <option value="Expired">Expired</option>
                </select>
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
