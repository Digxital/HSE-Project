import React from 'react';
import type { DemoRequest } from '@/services/demoRequestService';

interface DemoRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: DemoRequest | null;
}

export const DemoRequestDetailModal: React.FC<DemoRequestDetailModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  if (!isOpen || !request) return null;

  const fields: Array<{ label: string; value: string | undefined }> = [
    { label: 'Full Name', value: `${request.firstName} ${request.lastName}` },
    { label: 'Work Email', value: request.email },
    { label: 'Phone Number', value: request.phone },
    { label: 'Company / Organization', value: request.company },
    { label: 'Job Title', value: request.jobTitle },
    { label: 'Country / Region', value: request.country },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#121212] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 pr-8">Demo Request</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Submitted {new Date(request.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>

        <div className="space-y-4">
          {fields.map(
            (field) =>
              field.value && (
                <div key={field.label}>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    {field.label}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">{field.value}</p>
                </div>
              )
          )}

          {request.message && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Additional Comments / Requirements
              </p>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{request.message}</p>
            </div>
          )}
        </div>

        <a
          href={`mailto:${request.email}`}
          className="mt-6 inline-flex items-center justify-center w-full px-6 py-3 bg-[#200500] hover:bg-[#1a0400] text-white font-semibold rounded-lg transition-colors"
        >
          Reply via Email
        </a>
      </div>
    </div>
  );
};
