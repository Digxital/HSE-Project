import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import johnMatthewsImg from '@/assets/images/Jhn-Matthew-profileImg.jpg';

export const ProfilePage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state for edit mode
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    phoneNumber: '',
    role: 'Admin',
    location: 'Houston Office',
  });

  // Mock user data
  const user = {
    name: 'John Matthews',
    role: 'Role: Admin',
    status: 'Active',
    profileImage: johnMatthewsImg,
    stats: {
      reportsSubmitted: 15,
      actionsAssigned: 0,
      validCertifications: 4,
      expiredCertifications: 1,
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    // In real app, save to backend
    setShowConfirmModal(false);
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Profile"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
          userName="Peter Omogbolahan"
          userRole="System Administrator"
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Arrow - Only shown in edit mode */}
            {isEditMode && (
              <button
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </button>
            )}

            {/* User Profile Card */}
            <div className="bg-[#FFFAF5] rounded-xl p-6 md:p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Left: Profile Info */}
                <div className="flex items-start gap-4">
                  {/* Profile Photo */}
                  <div className="relative">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
                    />
                  </div>

                  {/* Name, Role, Status */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-600">{user.role}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Edit/Save Button */}
                {isEditMode ? (
                  <button 
                    onClick={handleSaveChanges}
                    className="w-full md:w-auto px-6 py-2.5 bg-[#C24438] text-white rounded-lg hover:bg-[#A63830] transition-colors text-sm font-medium"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditMode(true)}
                    className="w-full md:w-auto px-6 py-2.5 bg-[#C24438] text-white rounded-lg hover:bg-[#A63830] transition-colors text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Edit Form - Only shown in edit mode */}
              {isEditMode && (
                <div className="mt-8 space-y-4">
                  {/* Row 1: First Name & Surname */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#FFF9F5] border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#FFF9F5] border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${errors.surname ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.surname && <p className="mt-1 text-sm text-red-500">{errors.surname}</p>}
                    </div>
                  </div>

                  {/* Row 2: Email & Phone Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#FFF9F5] border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#FFF9F5] border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
                    </div>
                  </div>

                  {/* Row 3: Role & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Report Submitted */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Report Submitted</p>
                <p className="text-3xl font-bold text-gray-900">{user.stats.reportsSubmitted}</p>
              </div>

              {/* Actions Assigned */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Actions Assigned</p>
                <p className="text-3xl font-bold text-gray-900">{user.stats.actionsAssigned}</p>
              </div>

              {/* Valid Certifications */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Valid Certifications</p>
                <p className="text-3xl font-bold text-gray-900">{user.stats.validCertifications}</p>
              </div>

              {/* Expired Certifications */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Expired Certifications</p>
                <p className="text-3xl font-bold text-[#C24438]">{user.stats.expiredCertifications}</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Save Changes Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center transition-opacity duration-300"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 relative transform transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Check Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-center text-lg font-semibold text-gray-900 mb-2">Save Changes?</h3>

            {/* Message */}
            <p className="text-center text-gray-500 mb-6">
              Are you sure you want to save the changes to your profile?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 py-3 bg-[#C24438] hover:bg-[#A63830] text-white rounded-lg font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
