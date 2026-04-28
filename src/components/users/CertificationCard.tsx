import React from 'react';
import type { Certification } from '@/services/certificationService';

interface CertificationCardProps {
  certification: Certification;
  onDeleteClick?: (certificationId: string, certificationName: string) => void;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  onDeleteClick,
}) => {
  const getStatusBadgeStyle = (status?: string) => {
    switch (status) {
      case 'Valid':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleDeleteClick = () => {
    if (onDeleteClick) {
      onDeleteClick(certification.id, certification.name);
    }
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          {certification.name}
        </h4>

        {/* Issued by */}
        <p className="text-xs text-gray-600 mb-2">
          Issued by: <span className="font-medium">{certification.issuedBy}</span>
        </p>

        {/* Dates */}
        <div className="text-xs text-gray-600 flex flex-wrap gap-3">
          <span>Issued Date: {formatDate(certification.issueDate)}</span>
          <span className={`${
            certification.status === 'Expired'
              ? 'text-red-600 font-medium'
              : 'text-gray-600'
          }`}>
            {certification.status === 'Expired' && '•'} Expiry Date: {formatDate(certification.expiryDate)}
          </span>
        </div>
      </div>

      {/* Actions Container */}
      <div className="flex-shrink-0 flex items-center gap-3">
        {/* Status badge */}
        <span
          className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusBadgeStyle(
            certification.status
          )}`}
        >
          {certification.status || 'Valid'}
        </span>

        {/* Delete Button */}
        {onDeleteClick && (
          <button
            onClick={handleDeleteClick}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
            title="Delete certification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
