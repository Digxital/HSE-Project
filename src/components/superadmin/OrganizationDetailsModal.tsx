import React, { useState } from 'react';

interface OrganizationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: {
    id: string;
    name: string;
    status: 'Active' | 'Pending' | 'Suspended';
    subscriptionPlan: 'Enterprise' | 'Premium' | 'Basic' | 'Free';
    createdDate: string;
    tenantId?: string;
    primaryColor?: string;
    secondaryColor?: string;
    image?: string;
    reportsSubmitted?: number;
    totalReports?: number;
    openActions?: number;
    activeCertifications?: number;
    primaryContactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    registeredAddress?: string;
    maximumUsers?: number;
    reportsStorageLimit?: string;
    dataRetentionPeriod?: string;
  } | null;
}

export const OrganizationDetailsModal: React.FC<OrganizationDetailsModalProps> = ({
  isOpen,
  onClose,
  organization,
}) => {
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);

  if (!organization) return null;

  const handleSuspendClick = () => {
    setShowSuspendConfirm(true);
  };

  const confirmSuspend = () => {
    console.log(`Organization ${getActionType()}:`, organization.id);
    setShowSuspendConfirm(false);
    onClose();
  };

  const getActionType = () => {
    if (organization.status === 'Active') return 'suspended';
    if (organization.status === 'Pending') return 'activated';
    if (organization.status === 'Suspended') return 'reactivated';
    return 'updated';
  };

  const getButtonText = () => {
    if (organization.status === 'Active') return 'Suspend Organization';
    if (organization.status === 'Pending') return 'Activate Organization';
    if (organization.status === 'Suspended') return 'Reactivate Organization';
    return 'Update Organization';
  };

  const getButtonColor = () => {
    if (organization.status === 'Active') return 'bg-[#C2410C] hover:bg-[#a83409]';
    return 'bg-green-600 hover:bg-green-700';
  };

  const getConfirmationTitle = () => {
    if (organization.status === 'Active') return 'Suspend Organization?';
    if (organization.status === 'Pending') return 'Activate Organization?';
    if (organization.status === 'Suspended') return 'Reactivate Organization?';
    return 'Update Organization?';
  };

  const getConfirmationMessage = () => {
    if (organization.status === 'Active')
      return `Are you sure you want to suspend ${organization.name}? This organization will no longer be able to access the system.`;
    if (organization.status === 'Pending')
      return `Are you sure you want to activate ${organization.name}? This organization will be able to access the system.`;
    if (organization.status === 'Suspended')
      return `Are you sure you want to reactivate ${organization.name}? This organization will be able to access the system again.`;
    return `Are you sure you want to update ${organization.name}?`;
  };

  const getConfirmationButtonText = () => {
    if (organization.status === 'Active') return 'Suspend';
    if (organization.status === 'Pending') return 'Activate';
    if (organization.status === 'Suspended') return 'Reactivate';
    return 'Update';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[680px] bg-[#FFFAF5] dark:bg-[#121212] shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          </div>

          {/* Organization Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {organization.name} Overview
            </h2>
          </div>

          {/* Organization Profile Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              {/* Organization Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                {organization.image ? (
                  <img
                    src={organization.image}
                    alt={organization.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-semibold">
                    {organization.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {organization.name}
                </h3>
                {organization.primaryColor || organization.secondaryColor ? (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Pri colour: {organization.primaryColor || 'N/A'} | Sec colour: {organization.secondaryColor || 'N/A'}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      organization.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                        : organization.status === 'Pending'
                        ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30'
                        : 'bg-red-50 text-red-500 dark:bg-red-900/30'
                    }`}
                  >
                    {organization.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Organization Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Organization Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{organization.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Date Created</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {organization.createdDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tenant ID</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {organization.tenantId || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span
                  className={`text-sm font-medium ${
                    organization.status === 'Active'
                      ? 'text-green-600'
                      : organization.status === 'Pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {organization.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subscription Plan</span>
                <span className="text-sm font-medium text-[#C2410C]">{organization.subscriptionPlan}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reports Submitted</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {organization.reportsSubmitted || 0}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Reports</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {organization.totalReports || 0}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Open Actions</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {organization.openActions || 0}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Certifications</p>
                <p className="text-xl font-bold text-[#C2410C]">{organization.activeCertifications || 0}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Primary Contact Person</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {organization.primaryContactName || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email Address</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {organization.contactEmail || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Phone Number</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {organization.contactPhone || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Registered Address</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                  {organization.registeredAddress || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Settings */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Plan</span>
                <span className="text-sm font-medium text-[#C2410C]">{organization.subscriptionPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Maximum Users</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {organization.maximumUsers || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reports Storage Limit</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {organization.reportsStorageLimit || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data Retention Period</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {organization.dataRetentionPeriod || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Suspend/Activate/Reactivate Organization Button */}
          <button
            onClick={handleSuspendClick}
            className={`w-full font-semibold py-3 rounded-lg transition-colors text-white ${getButtonColor()}`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>

      {/* Suspend/Activate/Reactivate Confirmation Modal */}
      {showSuspendConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#121212] rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {getConfirmationTitle()}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {getConfirmationMessage()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSuspendConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspend}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg transition-colors ${getButtonColor()}`}
              >
                {getConfirmationButtonText()}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
