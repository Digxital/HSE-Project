import React, { useState } from 'react';

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onProceed: (subscriptionData: {
    subscriptionPlan: string;
    dataRetentionPeriod: string;
    maximumAllowedUsers: string;
    reportsStorageLimit: string;
  }) => void;
}

export const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onProceed,
}) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState('6 Months');
  const [maximumAllowedUsers, setMaximumAllowedUsers] = useState('100');
  const [reportsStorageLimit, setReportsStorageLimit] = useState('');

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();

    onProceed({
      subscriptionPlan,
      dataRetentionPeriod,
      maximumAllowedUsers,
      reportsStorageLimit,
    });
  };

  const handleClose = () => {
    // Reset form
    setSubscriptionPlan('');
    setDataRetentionPeriod('6 Months');
    setMaximumAllowedUsers('100');
    setReportsStorageLimit('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Modal */}
      <div
        className="bg-white dark:bg-[#121212] rounded-lg shadow-xl w-full max-w-2xl relative transform transition-all duration-300 scale-100 opacity-100"
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Subscription Plan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Register a new organization and configure its initial account settings.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleProceed} className="p-6">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum number of users allowed under this organization.</p>
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
                placeholder="Enter reports storage limit"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum reports allowed before storage limits apply</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onBack}
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
  );
};
