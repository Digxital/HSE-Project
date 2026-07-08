import React from 'react';

interface OrgSuspendedModalProps {
  isOpen: boolean;
  onDismiss?: () => void;
}

export const OrgSuspendedModal: React.FC<OrgSuspendedModalProps> = ({ isOpen, onDismiss }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white dark:bg-[#121212] rounded-lg shadow-xl w-[90%] max-w-md p-6 relative transform transition-all duration-300 scale-100 opacity-100 border dark:border-gray-700">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Organization Suspended
        </h3>

        {/* Message */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          Your organization has been suspended by the system administrator. You will be logged out automatically in a few seconds.
        </p>

        {/* Optional Dismiss Button (if you want users to be able to dismiss early) */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Logout Now
          </button>
        )}
      </div>
    </div>
  );
};
