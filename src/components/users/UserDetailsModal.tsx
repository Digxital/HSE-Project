import React, { useState, useEffect } from 'react';
import johnMatthewImg from '@/assets/images/avatar-profile-user.svg';
import { DeactivateUserModal } from './DeactivateUserModal';
import { AssignCertificationModal } from './AssignCertificationModal';
import { CertificationCard } from './CertificationCard';
import { userService } from '@/services/userService';
import { certificationService } from '@/services/certificationService';
import type { Certification } from '@/services/certificationService';
import { useToast } from '@/hooks/useToast';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUserStatus: (userId: string, newStatus: 'Active' | 'Deactivated' | 'Pending') => void;
  onUserUpdated?: () => void;
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

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onUpdateUserStatus,
  onUserUpdated 
}) => {
  // IMPORTANT: Check user BEFORE any hooks!
  if (!user) return null;

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showAssignCertificationModal, setShowAssignCertificationModal] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { showToast } = useToast();

  const [firstName, surname] = user.name.split(' ');

  // Load certifications from backend when modal opens
  useEffect(() => {
    if (!isOpen || !user?.id) return;

    const loadCertifications = async () => {
      try {
        console.log('📋 Loading certifications from backend for user:', user.id);
        const certs = await certificationService.getUserCertifications(user.id);
        console.log('✅ Loaded certifications from backend:', certs);
        setCertifications(certs);
      } catch (error) {
        console.error('❌ Error loading certifications:', error);
        setCertifications([]);
      }
    };

    loadCertifications();
  }, [isOpen, user?.id]);

  const handleAssignCertificationSuccess = (newCertification: Certification) => {
    console.log('✅ Certification assigned successfully:', newCertification);
    // Add the new certification to state immediately
    setCertifications(prev => [...prev, newCertification]);
    setShowAssignCertificationModal(false);
    showToast({
      type: 'success',
      message: 'Certification assigned successfully',
    });
  };

  const stats = {
    reportsSubmitted: user.stats?.reportsSubmitted || 15,
    actionsAssigned: user.stats?.actionsAssigned || 0,
    validCertifications: certifications.filter(c => c.status === 'Valid').length,
    expiredCertifications: certifications.filter(c => c.status === 'Expired').length,
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
    setIsEditing(true);
    setEditedUser({
      firstName: firstName,
      lastName: surname,
      email: user.email,
      role: user.role,
      location: user.location,
      status: user.status,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser({});
  };

  const handleSaveEdit = async () => {
  if (!user) {
    console.log('❌ No user data available');
    return;
  }
  
  console.log('📝 Starting save for user:', user.id);
  console.log('📝 Edited user data:', editedUser);
  console.log('📝 Original first name:', firstName);
  console.log('📝 Original surname:', surname);
  
  setIsSaving(true);
  try {
    // Prepare the data to update
    const updateData: any = {};
    
    // Check each field for changes
    if (editedUser.firstName !== undefined && editedUser.firstName !== firstName) {
      updateData.firstName = editedUser.firstName;
      console.log('📝 First name changed:', firstName, '->', editedUser.firstName);
    }
    if (editedUser.lastName !== undefined && editedUser.lastName !== surname) {
      updateData.lastName = editedUser.lastName;
      console.log('📝 Last name changed:', surname, '->', editedUser.lastName);
    }
    if (editedUser.email !== undefined && editedUser.email !== user.email) {
      updateData.email = editedUser.email;
      console.log('📝 Email changed:', user.email, '->', editedUser.email);
    }
    if (editedUser.role !== undefined && editedUser.role !== user.role) {
      updateData.role = editedUser.role;
      console.log('📝 Role changed:', user.role, '->', editedUser.role);
    }
    if (editedUser.location !== undefined && editedUser.location !== user.location) {
      updateData.location = editedUser.location;
      console.log('📝 Location changed:', user.location, '->', editedUser.location);
    }
    if (editedUser.status !== undefined && editedUser.status !== user.status) {
      // Convert status to lowercase for API
      updateData.status = editedUser.status.toLowerCase() as 'active' | 'pending' | 'inactive';
      console.log('📝 Status changed:', user.status, '->', editedUser.status, '(API:', updateData.status, ')');
    }
    
    console.log('📝 Update data to send:', updateData);
    
    // Only call API if there are changes
    if (Object.keys(updateData).length === 0) {
      console.log('📝 No changes to save');
      showToast({
        type: 'error',
        message: 'No changes to save'
      });
      setIsEditing(false);
      setEditedUser({});
      setIsSaving(false);
      return;
    }
    
    // Call the API
    console.log('📝 Calling userService.updateUser with:', user.id, updateData);
    const result = await userService.updateUser(user.id, updateData);
    console.log('✅ Update successful:', result);
    
    showToast({
      type: 'success',
      message: 'User updated successfully'
    });
    
    // Call the callback to refresh user list
    if (onUserUpdated) {
      console.log('📝 Calling onUserUpdated callback');
      await onUserUpdated();
    }
    
    // Also update the local status through the existing function if status changed
    if (updateData.status) {
      const newStatus = updateData.status === 'active' ? 'Active' : 
                       updateData.status === 'pending' ? 'Pending' : 'Deactivated';
      console.log('📝 Updating status to:', newStatus);
      onUpdateUserStatus(user.id, newStatus);
    }
    
    setIsEditing(false);
    setEditedUser({});
    
  } catch (error: any) {
    console.error('❌ Failed to update user:', error);
    console.error('❌ Error response:', error.response?.data);
    showToast({
      type: 'error',
      message: error.response?.data?.message || error.message || 'Failed to update user'
    });
  } finally {
    setIsSaving(false);
  }
};

  const handleInputChange = (field: string, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'SUPERVISOR': 'bg-blue-100 text-blue-800',
      'FIELD_USER': 'bg-green-100 text-green-800',
      'HSE_OFFICER': 'bg-orange-100 text-orange-800',
    };

    const displayRole = role.replace('_', ' ');
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {displayRole}
      </span>
    );
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
              src={user.name ? johnMatthewImg : johnMatthewImg}
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
              <p className="text-sm text-gray-600 mb-2">Role: {getRoleBadge(user.role)}</p>
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

          {/* Edit/Save/Cancel Buttons */}
          <div className="flex justify-end gap-2 mb-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </>
            ) : (
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
            )}
          </div>

          {/* User Details Form - All fields inactive until edit mode */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">First Name</label>
                <input
                  type="text"
                  value={isEditing ? editedUser.firstName || firstName : firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-900 text-sm ${
                    isEditing 
                      ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent' 
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Surname */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Surname</label>
                <input
                  type="text"
                  value={isEditing ? editedUser.lastName || surname : surname || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-900 text-sm ${
                    isEditing 
                      ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent' 
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={isEditing ? editedUser.email || user.email : user.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-900 text-sm ${
                    isEditing 
                      ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent' 
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Role - Could be a dropdown when editing */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Role</label>
                {isEditing ? (
                  <select
                    value={editedUser.role || user.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="FIELD_USER">Field User</option>
                    <option value="HSE_OFFICER">HSE Officer</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={user.role}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm cursor-not-allowed"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Location</label>
                <input
                  type="text"
                  value={isEditing ? editedUser.location || user.location : user.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-900 text-sm ${
                    isEditing 
                      ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent' 
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Status - Dropdown with Pending, Active, Inactive */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Status</label>
                {isEditing ? (
                  <select
                    value={editedUser.status || user.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Deactivated">Inactive</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={user.status}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm cursor-not-allowed"
                  />
                )}
              </div>
            </div>

            {/* Date Added */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Date Added</label>
              <input
                type="text"
                value={user.dateAdded || '02-12-2014'}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Certifications Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Certifications</h3>
                <p className="text-sm text-gray-600">Professional and Safety Certification</p>
              </div>
              {user.role === 'FIELD_USER' && user.status === 'Active' && (
                <button
                  onClick={() => setShowAssignCertificationModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C24438] hover:bg-[#a03830] text-white rounded-lg font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Assign Certification
                </button>
              )}
            </div>

            {/* Empty State */}
            {certifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg bg-white border border-gray-100">
                {/* Info Icon */}
                <div className="mb-3">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                {/* Empty State Text */}
                <p className="text-center text-gray-900 font-medium mb-2">No certifications assigned yet</p>
                <p className="text-center text-sm text-gray-600">Assign certifications to track training and compliance.</p>
              </div>
            )}

            {/* Certification Cards */}
            {certifications.length > 0 && (
              <div className="space-y-2">
                {certifications.map(cert => (
                  <CertificationCard
                    key={cert.id}
                    certification={cert}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      <DeactivateUserModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={confirmDeactivate}
      />

      {/* Assign Certification Modal */}
      <AssignCertificationModal
        isOpen={showAssignCertificationModal}
        onClose={() => setShowAssignCertificationModal(false)}
        userId={user?.id || ''}
        onSuccess={handleAssignCertificationSuccess}
      />
    </>
  );
};