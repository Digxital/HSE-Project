import React from 'react';

interface InvitationSentModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const InvitationSentModal: React.FC<InvitationSentModalProps> = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Invitation Sent
          </h3>
          <p className="text-gray-600">
            An invitation email has been sent to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: '#C24438' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A63A30'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C24438'}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InvitationSentModal;
