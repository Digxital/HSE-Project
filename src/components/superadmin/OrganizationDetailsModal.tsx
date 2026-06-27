import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { organizationService } from '@/services/organizationService';

interface Organization {
  _id: string;
  organizationName: string;
  organizationId: string;
  primaryContactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  organizationAddress: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

interface OrganizationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
}

export const OrganizationDetailsModal: React.FC<OrganizationDetailsModalProps> = ({
  isOpen,
  onClose,
  organization,
}) => {
  const { showToast } = useToast();
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [detailedOrg, setDetailedOrg] = useState<Organization | null>(null);

  // Fetch detailed organization data
  useEffect(() => {
    if (isOpen && organization) {
      setIsLoading(true);
      organizationService
        .getOrganizationById(organization._id)
        .then((response) => {
          setDetailedOrg(response.data);
        })
        .catch((error) => {
          showToast({
            type: 'error',
            message: 'Failed to load organization details.',
          });
          setDetailedOrg(organization);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, organization]);

  if (!organization) return null;

  const org = detailedOrg || organization;

  const handleSuspendClick = () => {
    setShowSuspendConfirm(true);
  };

  const confirmSuspend = async () => {
    setShowSuspendConfirm(false);
    setIsActionLoading(true);

    try {
      let action: 'deactivate' | 'activate' = 'deactivate';

      // Determine action based on current status
      if (org.status === 'ACTIVE') {
        action = 'deactivate'; // Deactivate/Suspend
      } else if (org.status === 'INACTIVE' || org.status === 'PENDING' || org.status === 'SUSPENDED') {
        action = 'activate'; // Activate/Reactivate
      }

      const response = await organizationService.updateOrganizationStatus(org._id, action);

      // Update the detailed org state with new data
      setDetailedOrg(response.data);

      showToast({
        type: 'success',
        message: `Organization ${getActionType()} successfully`,
      });

      // Emit event to trigger context refresh
      window.dispatchEvent(new CustomEvent('organizationUpdated'));

      // Close modal after brief delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update organization status',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const getActionType = () => {
    if (org.status === 'ACTIVE') return 'suspended';
    if (org.status === 'PENDING') return 'activated';
    if (org.status === 'INACTIVE' || org.status === 'SUSPENDED') return 'reactivated';
    return 'updated';
  };

  const getButtonText = () => {
    if (org.status === 'ACTIVE') return 'Suspend Organization';
    if (org.status === 'PENDING') return 'Activate Organization';
    if (org.status === 'INACTIVE' || org.status === 'SUSPENDED') return 'Reactivate Organization';
    return 'Update Organization';
  };

  const getButtonColor = () => {
    if (org.status === 'ACTIVE') return 'bg-[#C2410C] hover:bg-[#a83409]';
    return 'bg-green-600 hover:bg-green-700';
  };

  const getConfirmationTitle = () => {
    if (org.status === 'ACTIVE') return 'Suspend Organization?';
    if (org.status === 'PENDING') return 'Activate Organization?';
    if (org.status === 'INACTIVE' || org.status === 'SUSPENDED') return 'Reactivate Organization?';
    return 'Update Organization?';
  };

  const getConfirmationMessage = () => {
    if (org.status === 'ACTIVE')
      return `Are you sure you want to suspend ${org.organizationName}? This organization will no longer be able to access the system.`;
    if (org.status === 'PENDING')
      return `Are you sure you want to activate ${org.organizationName}? This organization will be able to access the system.`;
    if (org.status === 'INACTIVE' || org.status === 'SUSPENDED')
      return `Are you sure you want to reactivate ${org.organizationName}? This organization will be able to access the system again.`;
    return `Are you sure you want to update ${org.organizationName}?`;
  };

  const getConfirmationButtonText = () => {
    if (org.status === 'ACTIVE') return 'Suspend';
    if (org.status === 'PENDING') return 'Activate';
    if (org.status === 'INACTIVE' || org.status === 'SUSPENDED') return 'Reactivate';
    return 'Update';
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleteLoading(true);

    try {
      await organizationService.deleteOrganization(org._id);

      showToast({
        type: 'success',
        message: `Organization ${org.organizationName} deleted successfully`,
      });

      // Close modal after brief delay
      setTimeout(() => {
        onClose();
        // Trigger a refresh of the organizations list
        window.dispatchEvent(new CustomEvent('organizationDeleted'));
      }, 500);
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete organization',
      });
    } finally {
      setIsDeleteLoading(false);
    }
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
              {org.organizationName} Overview
            </h2>
          </div>

          {/* Organization Profile Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              {/* Organization Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-semibold">
                  {org.organizationName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {org.organizationName}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      org.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                        : org.status === 'PENDING'
                        ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30'
                        : 'bg-red-50 text-red-500 dark:bg-red-900/30'
                    }`}
                  >
                    {org.status === 'ACTIVE' ? 'Active' : org.status === 'PENDING' ? 'Pending' : org.status === 'INACTIVE' ? 'Inactive' : 'Suspended'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <svg className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C2410C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity={0.2} />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">Loading details...</p>
              </div>
            </div>
          )}

          {!isLoading && (
            <>
              {/* Organization Details */}
              <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Organization Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Organization Name</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{org.organizationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Organization ID</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{org.organizationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date Created</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(org.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span
                      className={`text-sm font-medium ${
                        org.status === 'ACTIVE'
                          ? 'text-green-600'
                          : org.status === 'PENDING'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {org.status === 'ACTIVE' ? 'Active' : org.status === 'PENDING' ? 'Pending' : org.status === 'INACTIVE' ? 'Inactive' : 'Suspended'}
                    </span>
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
                      {org.primaryContactPersonName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email Address</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {org.contactEmail || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Phone Number</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {org.contactPhoneNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Registered Address</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                      {org.organizationAddress || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Suspend/Activate/Reactivate Organization Button */}
              <button
                onClick={handleSuspendClick}
                disabled={isActionLoading}
                className={`w-full font-semibold py-3 rounded-lg transition-colors text-white flex items-center justify-center gap-2 ${getButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isActionLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity={0.2} />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  getButtonText()
                )}
              </button>

              {/* Delete Organization Button */}
              <button
                onClick={handleDeleteClick}
                disabled={isDeleteLoading}
                className="w-full mt-3 font-semibold py-3 rounded-lg transition-colors text-red-600 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleteLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity={0.2} />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete Organization'
                )}
              </button>
            </>
          )}
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
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspend}
                disabled={isActionLoading}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg transition-colors flex items-center justify-center gap-2 ${getButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isActionLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity={0.2} />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  getConfirmationButtonText()
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#121212] rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Organization?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. The organization <span className="font-semibold text-gray-900 dark:text-white">{org.organizationName}</span> and all associated data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleteLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleteLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 border border-transparent rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleteLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity={0.2} />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
