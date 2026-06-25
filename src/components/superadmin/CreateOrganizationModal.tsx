import React, { useState } from 'react';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrganizationCreated: (orgData: {
    organizationName: string;
    organizationSlug: string;
    primaryContactName: string;
    contactEmail: string;
    contactPhone: string;
    organizationAddress: string;
  }) => void;
}

export const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onOrganizationCreated,
}) => {
  const [organizationName, setOrganizationName] = useState('');
  const [organizationSlug, setOrganizationSlug] = useState('');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [organizationAddress, setOrganizationAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!organizationSlug.trim()) {
      newErrors.organizationSlug = 'Organization ID/Slug is required';
    }

    if (!primaryContactName.trim()) {
      newErrors.primaryContactName = 'Primary contact person name is required';
    }

    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }

    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone number is required';
    }

    if (!organizationAddress.trim()) {
      newErrors.organizationAddress = 'Organization address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onOrganizationCreated({
      organizationName,
      organizationSlug,
      primaryContactName,
      contactEmail,
      contactPhone,
      organizationAddress,
    });

    // Reset form
    setOrganizationName('');
    setOrganizationSlug('');
    setPrimaryContactName('');
    setContactEmail('');
    setContactPhone('');
    setOrganizationAddress('');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setOrganizationName('');
    setOrganizationSlug('');
    setPrimaryContactName('');
    setContactEmail('');
    setContactPhone('');
    setOrganizationAddress('');
    setErrors({});
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className={`bg-white dark:bg-[#121212] rounded-lg shadow-xl w-full max-w-2xl relative transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Create New Organization</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Register a new organization and configure its initial account settings.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Organization Name and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => {
                      setOrganizationName(e.target.value);
                      if (errors.organizationName) setErrors(prev => ({ ...prev, organizationName: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                      errors.organizationName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter organization name"
                  />
                  {errors.organizationName && (
                    <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization ID / Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={organizationSlug}
                    onChange={(e) => {
                      setOrganizationSlug(e.target.value);
                      if (errors.organizationSlug) setErrors(prev => ({ ...prev, organizationSlug: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                      errors.organizationSlug ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="org-slug"
                  />
                  {errors.organizationSlug && (
                    <p className="text-red-500 text-xs mt-1">{errors.organizationSlug}</p>
                  )}
                </div>
              </div>

              {/* Primary Contact Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Primary Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={primaryContactName}
                  onChange={(e) => {
                    setPrimaryContactName(e.target.value);
                    if (errors.primaryContactName) setErrors(prev => ({ ...prev, primaryContactName: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                    errors.primaryContactName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact person's full name"
                />
                {errors.primaryContactName && (
                  <p className="text-red-500 text-xs mt-1">{errors.primaryContactName}</p>
                )}
              </div>

              {/* Contact Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value);
                      if (errors.contactEmail) setErrors(prev => ({ ...prev, contactEmail: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contact@organization.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => {
                      setContactPhone(e.target.value);
                      if (errors.contactPhone) setErrors(prev => ({ ...prev, contactPhone: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>
                  )}
                </div>
              </div>

              {/* Organization Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organization Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={organizationAddress}
                  onChange={(e) => {
                    setOrganizationAddress(e.target.value);
                    if (errors.organizationAddress) setErrors(prev => ({ ...prev, organizationAddress: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                    errors.organizationAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization address"
                />
                {errors.organizationAddress && (
                  <p className="text-red-500 text-xs mt-1">{errors.organizationAddress}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#C2410C] border border-transparent rounded-lg hover:bg-[#a83409] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
