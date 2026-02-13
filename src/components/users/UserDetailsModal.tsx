import React, { useState } from 'react';
import johnMatthewImg from '@/assets/images/Jhn-Matthew-profileImg.jpg';
import { DeactivateUserModal } from './DeactivateUserModal';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUserStatus: (userId: string, newStatus: 'Active' | 'Deactivated' | 'Pending') => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    location: string;
    status: 'Active' | 'Deactivated' | 'Pending';
    lastLogin: string;
    firstName?: string;
    surname?: string;
    dateAdded?: string;
    stats?: {
      reportsSubmitted: number;
      actionsAssigned: number;
      validCertifications: number;
      expiredCertifications: number;
    };
  } | null;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user, onUpdateUserStatus }) => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  
  if (!user) return null;

  const [firstName, surname] = user.name.split(' ');

  const stats = user.stats || {
    reportsSubmitted: 15,
    actionsAssigned: 0,
    validCertifications: 4,
    expiredCertifications: user.status === 'Deactivated' ? 1 : 0,
  };

  const handleReactivate = () => {
    if (user) {
      onUpdateUserStatus(user.id, 'Active');
    }
  };

  const handleDeactivate = () => {
    setShowDeactivateModal(true);
  };

  const confirmDeactivate = () => {
    if (user) {
      onUpdateUserStatus(user.id, 'Deactivated');
    }
    setShowDeactivateModal(false);
  };

  const handleEdit = () => {
    // Handle edit logic
    console.log('Edit user:', user.id);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[680px] bg-[#FFFAF5] shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FFF9F5] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-start gap-4 mb-6">
            <img
              src={user.name === 'John Matthews' ? johnMatthewImg : undefined}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover bg-gradient-to-br from-[#C24438] to-[#a03830]"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
            <div className="hidden w-20 h-20 rounded-full bg-gradient-to-br from-[#C24438] to-[#a03830]">
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-sm text-gray-600 mb-2">Role: {user.role}</p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  user.status === 'Active'
                    ? 'text-green-700 bg-green-50'
                    : user.status === 'Deactivated'
                    ? 'text-red-700 bg-red-50'
                    : 'text-yellow-700 bg-yellow-50'
                }`}
              >
                <span className="text-lg">•</span>
                {user.status}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">Report Submitted</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.reportsSubmitted}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">Actions Assigned</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.actionsAssigned}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">Valid Certifications</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.validCertifications}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">Expired Certifications</p>
              <p className={`text-2xl font-semibold ${stats.expiredCertifications > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stats.expiredCertifications}
              </p>
            </div>
          </div>

          {/* Reactivate Button */}
          {user.status === 'Deactivated' && (
            <button
              onClick={handleReactivate}
              className="w-full py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium mb-3 transition-colors border border-green-200"
            >
              Reactivate User
            </button>
          )}

          {/* Deactivate Button */}
          {user.status === 'Active' && (
            <button
              onClick={handleDeactivate}
              className="w-full py-3 bg-[#FF3B30] hover:bg-[#E6342A] text-white rounded-lg font-medium mb-3 transition-colors"
            >
              Deactivate User
            </button>
          )}

          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-[#C24438] hover:bg-[#a03830] text-white rounded-lg flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          </div>

          {/* User Details Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                />
              </div>

              {/* Surname */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Surname</label>
                <input
                  type="text"
                  value={surname || ''}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Role</label>
                <input
                  type="text"
                  value={user.role}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Location</label>
                <input
                  type="text"
                  value={user.location}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Status</label>
                <input
                  type="text"
                  value={user.status}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Date Added */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Date Added</label>
              <input
                type="text"
                value={user.dateAdded || '02-12-2014'}
                readOnly
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      <DeactivateUserModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={confirmDeactivate}
      />
    </>
  );
};
