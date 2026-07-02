import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { organizationService } from '@/services/organizationService';

interface CreateOrganizationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onOrganizationCreated: (data: any) => void;
}

type FlowStep = 'organization' | 'subscription' | 'branding';

interface OrganizationData {
  organizationName: string;
  primaryContactName: string;
  contactEmail: string;
  contactPhone: string;
  organizationAddress: string;
  password: string;
}

export const CreateOrganizationFlow: React.FC<CreateOrganizationFlowProps> = ({
  isOpen,
  onClose,
  onOrganizationCreated,
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<FlowStep>('organization');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Organization form state
  const [organizationName, setOrganizationName] = useState('');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [organizationAddress, setOrganizationAddress] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [orgErrors, setOrgErrors] = useState<Record<string, string>>({});

  // Subscription form state
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState('6 Months');
  const [maximumAllowedUsers, setMaximumAllowedUsers] = useState('100');
  const [reportsStorageLimit, setReportsStorageLimit] = useState('');

  // Branding form state
  const [primaryThemeColor, setPrimaryThemeColor] = useState('');
  const [secondaryThemeColor, setSecondaryThemeColor] = useState('');
  const [customApplicationTitle, setCustomApplicationTitle] = useState('');

  const normalizeEmail = (value: string) => value.trim().toLowerCase();
  const normalizeText = (value: string) => value.trim();

  const handleOrganizationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedOrganizationName = normalizeText(organizationName);
    const normalizedPrimaryContactName = normalizeText(primaryContactName);
    const normalizedContactEmail = normalizeEmail(contactEmail);
    const normalizedContactPhone = normalizeText(contactPhone);
    const normalizedOrganizationAddress = normalizeText(organizationAddress);

    const newErrors: Record<string, string> = {};
    if (!normalizedOrganizationName) newErrors.organizationName = 'Organization name is required';
    if (!normalizedPrimaryContactName) newErrors.primaryContactName = 'Contact person name is required';
    if (!normalizedContactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedContactEmail))
      newErrors.contactEmail = 'Valid email is required';
    if (!normalizedContactPhone) newErrors.contactPhone = 'Phone number is required';
    if (!normalizedOrganizationAddress) newErrors.organizationAddress = 'Address is required';
    if (!adminPassword) newErrors.adminPassword = 'Admin password is required';
    else if (adminPassword.length < 8) newErrors.adminPassword = 'Password must be at least 8 characters';
    if (adminPassword !== confirmAdminPassword) newErrors.confirmAdminPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setOrgErrors(newErrors);
      return;
    }

    const data: OrganizationData = {
      organizationName: normalizedOrganizationName,
      primaryContactName: normalizedPrimaryContactName,
      contactEmail: normalizedContactEmail,
      contactPhone: normalizedContactPhone,
      organizationAddress: normalizedOrganizationAddress,
      password: adminPassword,
    };

    setOrganizationData(data);
    setSlideDirection('left');
    setCurrentStep('subscription');
  };

  const handleSubscriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationData) return;

    // Move to branding step
    setSlideDirection('left');
    setCurrentStep('branding');
  };

  const handleBrandingBack = () => {
    setSlideDirection('right');
    setCurrentStep('subscription');
  };

  const handleBrandingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationData) return;

    setIsSubmitting(true);

    const payload = {
      organizationName: organizationData.organizationName,
      primaryContactPersonName: organizationData.primaryContactName,
      contactEmail: organizationData.contactEmail,
      contactPhoneNumber: organizationData.contactPhone,
      organizationAddress: organizationData.organizationAddress,
      password: organizationData.password,
    };

    organizationService
      .createOrganization(payload)
      .then((response) => {
        showToast({
          type: 'success',
          message: 'Organization created successfully!',
        });

        // Emit event to trigger context refresh
        window.dispatchEvent(new CustomEvent('organizationUpdated'));

        // Call the callback with the created organization data
        onOrganizationCreated(response.data);
        handleClose();
      })
      .catch((error) => {
        const backendMessage = error?.message || 'Failed to create organization. Please try again.';
        const isDuplicateEmail = /already exists|duplicate|contact email/i.test(backendMessage);
        showToast({
          type: 'error',
          message: isDuplicateEmail
            ? `Contact email \"${organizationData.contactEmail}\" is already tied to another account. Use another email or verify existing users in backend.`
            : backendMessage,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSubscriptionBack = () => {
    setSlideDirection('right');
    setCurrentStep('organization');
  };

  const handleClose = () => {
    setCurrentStep('organization');
    setSlideDirection('left');
    setOrganizationData(null);
    setIsSubmitting(false);
    
    // Reset forms
    setOrganizationName('');
    setPrimaryContactName('');
    setContactEmail('');
    setContactPhone('');
    setOrganizationAddress('');
    setAdminPassword('');
    setConfirmAdminPassword('');
    setOrgErrors({});
    setSubscriptionPlan('');
    setDataRetentionPeriod('6 Months');
    setMaximumAllowedUsers('100');
    setReportsStorageLimit('');
    setPrimaryThemeColor('');
    setSecondaryThemeColor('');
    setCustomApplicationTitle('');

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Container with overflow hidden to prevent horizontal scroll */}
        <div className="w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Organization Modal Panel */}
          <div
            className={`transform transition-all duration-500 ${
              currentStep === 'organization'
                ? 'translate-x-0 opacity-100 relative'
                : slideDirection === 'left'
                ? '-translate-x-full opacity-0 absolute inset-0'
                : 'translate-x-full opacity-0 absolute inset-0'
            }`}
          >
            <div className="bg-white dark:bg-[#121212] rounded-lg shadow-xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Create New Organization</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Register a new organization and configure its initial account settings.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleOrganizationSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Organization Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => {
                        setOrganizationName(e.target.value);
                        if (orgErrors.organizationName) setOrgErrors(prev => ({ ...prev, organizationName: '' }));
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                        orgErrors.organizationName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter organization name"
                    />
                    {orgErrors.organizationName && <p className="text-red-500 text-xs mt-1">{orgErrors.organizationName}</p>}
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
                        if (orgErrors.primaryContactName) setOrgErrors(prev => ({ ...prev, primaryContactName: '' }));
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                        orgErrors.primaryContactName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact person's full name"
                    />
                    {orgErrors.primaryContactName && <p className="text-red-500 text-xs mt-1">{orgErrors.primaryContactName}</p>}
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
                          if (orgErrors.contactEmail) setOrgErrors(prev => ({ ...prev, contactEmail: '' }));
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                          orgErrors.contactEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="contact@organization.com"
                      />
                      {orgErrors.contactEmail && <p className="text-red-500 text-xs mt-1">{orgErrors.contactEmail}</p>}
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
                          if (orgErrors.contactPhone) setOrgErrors(prev => ({ ...prev, contactPhone: '' }));
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                          orgErrors.contactPhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                      {orgErrors.contactPhone && <p className="text-red-500 text-xs mt-1">{orgErrors.contactPhone}</p>}
                    </div>
                  </div>

                  {/* Admin Password and Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Admin Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          if (orgErrors.adminPassword) setOrgErrors(prev => ({ ...prev, adminPassword: '' }));
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                          orgErrors.adminPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter password for organization admin"
                      />
                      {orgErrors.adminPassword ? (
                        <p className="text-red-500 text-xs mt-1">{orgErrors.adminPassword}</p>
                      ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Used by the contact email above to log in as this organization's admin.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={confirmAdminPassword}
                        onChange={(e) => {
                          setConfirmAdminPassword(e.target.value);
                          if (orgErrors.confirmAdminPassword) setOrgErrors(prev => ({ ...prev, confirmAdminPassword: '' }));
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                          orgErrors.confirmAdminPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Re-enter password"
                      />
                      {orgErrors.confirmAdminPassword && <p className="text-red-500 text-xs mt-1">{orgErrors.confirmAdminPassword}</p>}
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
                        if (orgErrors.organizationAddress)
                          setOrgErrors(prev => ({ ...prev, organizationAddress: '' }));
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 ${
                        orgErrors.organizationAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter organization address"
                    />
                    {orgErrors.organizationAddress && <p className="text-red-500 text-xs mt-1">{orgErrors.organizationAddress}</p>}
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

          {/* Subscription Plan Modal Panel */}
          <div
            className={`transform transition-all duration-500 ${
              currentStep === 'subscription'
                ? 'translate-x-0 opacity-100 relative'
                : slideDirection === 'left'
                ? 'translate-x-full opacity-0 absolute inset-0'
                : '-translate-x-full opacity-0 absolute inset-0'
            }`}
          >
            <div className="bg-white dark:bg-[#121212] rounded-lg shadow-xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Subscription Plan</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Register a new organization and configure its initial account settings.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubscriptionSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Subscription Plan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subscription Plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={subscriptionPlan}
                      onChange={(e) => setSubscriptionPlan(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select subscription plan</option>
                      <option value="Free">Free</option>
                      <option value="Basic">Basic</option>
                      <option value="Premium">Premium</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>

                  {/* Data Retention Period and Maximum Allowed Users */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data Retention Period <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={dataRetentionPeriod}
                        onChange={(e) => setDataRetentionPeriod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="3 Years">3 Years</option>
                        <option value="Unlimited">Unlimited</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Maximum Allowed Users <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={maximumAllowedUsers}
                        onChange={(e) => setMaximumAllowedUsers(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Maximum number of users allowed under this organization.
                      </p>
                    </div>
                  </div>

                  {/* Reports Storage Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reports Storage Limit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={reportsStorageLimit}
                      onChange={(e) => setReportsStorageLimit(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter phone number"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Maximum reports allowed before storage limits apply
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleSubscriptionBack}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C] transition-colors"
                  >
                    Back
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

          {/* Branding Settings Modal Panel */}
          <div
            className={`transform transition-all duration-500 ${
              currentStep === 'branding'
                ? 'translate-x-0 opacity-100 relative'
                : slideDirection === 'left'
                ? 'translate-x-full opacity-0 absolute inset-0'
                : '-translate-x-full opacity-0 absolute inset-0'
            }`}
          >
            <div className="bg-white dark:bg-[#121212] rounded-lg shadow-xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Branding Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Register a new organization and configure its initial account settings.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleBrandingSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Primary Theme Color and Secondary Theme Color */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Primary Theme Color
                      </label>
                      <input
                        type="text"
                        value={primaryThemeColor}
                        onChange={(e) => setPrimaryThemeColor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Pick primary colour"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Secondary Theme Color
                      </label>
                      <input
                        type="text"
                        value={secondaryThemeColor}
                        onChange={(e) => setSecondaryThemeColor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Pick secondary colour"
                      />
                    </div>
                  </div>

                  {/* Custom Application Title and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Custom Application Title
                      </label>
                      <input
                        type="text"
                        value={customApplicationTitle}
                        onChange={(e) => setCustomApplicationTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder=""
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                        Pending
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Default — activate after creation</p>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleBrandingBack}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#C2410C] border border-transparent rounded-lg hover:bg-[#a83409] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Save & Create
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
