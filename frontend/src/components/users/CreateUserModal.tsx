import React, { useState, useEffect } from 'react';
import { type CreateUserData } from '@/services/userService';
import { useToast } from '@/hooks/useToast';
import { microsoft365Service, type MicrosoftSku } from '@/services/microsoft365Service';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (userData: CreateUserData) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [createMicrosoftAccount, setCreateMicrosoftAccount] = useState(false);
  const [assignLicense, setAssignLicense] = useState(false);
  const [availableSkus, setAvailableSkus] = useState<MicrosoftSku[]>([]);
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch SKUs when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableSkus();
    }
  }, [isOpen]);

  const fetchAvailableSkus = async () => {
    try {
      const skus = await microsoft365Service.getAvailableSkus();
      setAvailableSkus(skus);
      if (skus.length > 0) {
        setSelectedSku(skus[0].skuId); // Set first SKU as default
      }
    } catch (error) {
      console.error('Failed to fetch SKUs:', error);
      showToast({
        type: 'error',
        message: 'Failed to load Microsoft license options',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!role) {
      newErrors.role = 'Role is required';
    }

    if (!jobPosition) {
      newErrors.jobPosition = 'Job position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData: CreateUserData = {
        firstName,
        lastName,
        email,
        role,
        jobPosition,
        createMicrosoftAccount,
        assignLicense: assignLicense && createMicrosoftAccount,
        licenseSkuId: assignLicense && createMicrosoftAccount ? selectedSku : undefined,
      };

      await onUserCreated(userData);
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('');
      setJobPosition('');
      setCreateMicrosoftAccount(false);
      setAssignLicense(false);
      setSelectedSku(availableSkus[0]?.skuId || '');
      setErrors({});
      
      // Close modal
      onClose();
      
    } catch (error: any) {
      console.error('Create user error:', error);
      showToast({
        type: 'error',
        message: error.message || 'Failed to create user. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className={`bg-white rounded-lg shadow-xl w-full max-w-2xl relative transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-6 right-6 p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-6 pb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Create New User</h2>
            <p className="text-sm text-gray-500">Add a user to the system and optionally create Microsoft 365 account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <div className="space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) {
                        setErrors(prev => ({ ...prev, firstName: '' }));
                      }
                    }}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) {
                        setErrors(prev => ({ ...prev, lastName: '' }));
                      }
                    }}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: '' }));
                      }
                    }}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="user@yourcompany.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (errors.role) {
                        setErrors(prev => ({ ...prev, role: '' }));
                      }
                    }}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-gray-700 bg-white disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Choose role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="FIELD_USER">Field User</option>
                    <option value="HSE_OFFICER">HSE Officer</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
              </div>

              {/* Job Position */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Job Position</label>
                <select
                  value={jobPosition}
                  onChange={(e) => {
                    setJobPosition(e.target.value);
                    if (errors.jobPosition) {
                      setErrors(prev => ({ ...prev, jobPosition: '' }));
                    }
                  }}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-gray-700 bg-white disabled:bg-gray-50 disabled:text-gray-500 ${
                    errors.jobPosition ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose position</option>
                  <option value="Safety Manager">Safety Manager</option>
                  <option value="Field Supervisor">Field Supervisor</option>
                  <option value="HSE Officer">HSE Officer</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Technician">Technician</option>
                </select>
                {errors.jobPosition && (
                  <p className="text-red-500 text-xs mt-1">{errors.jobPosition}</p>
                )}
              </div>

              {/* Microsoft 365 Options */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Microsoft 365 Integration</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createMicrosoftAccount}
                      onChange={(e) => setCreateMicrosoftAccount(e.target.checked)}
                      disabled={isLoading}
                      className="w-4 h-4 text-[#C24438] border-gray-300 rounded focus:ring-[#C24438]"
                    />
                    <span className="text-sm text-gray-700">Create Microsoft 365 account</span>
                  </label>

                  {createMicrosoftAccount && (
                    <>
                      <label className="flex items-center space-x-3 cursor-pointer ml-7">
                        <input
                          type="checkbox"
                          checked={assignLicense}
                          onChange={(e) => setAssignLicense(e.target.checked)}
                          disabled={isLoading}
                          className="w-4 h-4 text-[#C24438] border-gray-300 rounded focus:ring-[#C24438]"
                        />
                        <span className="text-sm text-gray-700">Assign Microsoft 365 license</span>
                      </label>

                      {assignLicense && (
                        <div className="ml-7 mt-3">
                          <label className="block text-sm text-gray-700 mb-2">License Type</label>
                          <select
                            value={selectedSku}
                            onChange={(e) => setSelectedSku(e.target.value)}
                            disabled={isLoading || availableSkus.length === 0}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-gray-700 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            {availableSkus.length === 0 ? (
                              <option value="">No licenses available</option>
                            ) : (
                              availableSkus.map((sku) => (
                                <option key={sku.skuId} value={sku.skuId}>
                                  {sku.skuPartNumber} ({sku.consumedUnits}/{sku.prepaidUnits?.enabled || 0} used)
                                </option>
                              ))
                            )}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Select the appropriate license type for this user
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (createMicrosoftAccount && assignLicense && availableSkus.length === 0)}
                className="w-full py-3 bg-[#C24438] hover:bg-[#a03830] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating User...</span>
                  </>
                ) : (
                  <>
                    <span>Create User</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};