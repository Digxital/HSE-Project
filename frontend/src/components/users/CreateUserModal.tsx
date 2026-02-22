import React, { useState } from 'react';

interface CreateUserModal {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (userData: {
    firstName: string;
    surname: string;
    email: string;
    role: string;
    jobPosition: string;
    createMicrosoftAccount?: boolean;
  }) => void;
}
 
export const CreateUserModal: React.FC<CreateUserModal> = ({
  isOpen,
  onClose,
  onUserCreated,
}) => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [createMicrosoftAccount, setCreateMicrosoftAccount] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!surname.trim()) {
      newErrors.surname = 'Surname is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!role) {
      newErrors.role = 'Role is required';
    }

    if (!jobPosition) {
      newErrors.jobPosition = 'Job position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onUserCreated({
      firstName,
      surname,
      email,
      role,
      jobPosition,
      createMicrosoftAccount,
    });

    // Reset form
    setFirstName('');
    setSurname('');
    setEmail('');
    setRole('');
    setJobPosition('');
    setCreateMicrosoftAccount(false);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFirstName('');
    setSurname('');
    setEmail('');
    setRole('');
    setJobPosition('');
    setCreateMicrosoftAccount(false);
    setErrors({});
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className={`bg-white rounded-lg shadow-xl w-full max-w-2xl relative transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Create New User</h2>
            <p className="text-sm text-gray-500">Add a new user to the system</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* First Name and Surname */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => {
                      setSurname(e.target.value);
                      if (errors.surname) setErrors(prev => ({ ...prev, surname: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${
                      errors.surname ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter surname"
                  />
                  {errors.surname && (
                    <p className="text-red-500 text-xs mt-1">{errors.surname}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Role and Job Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select role</option>
                    {/* <option value="Admin">Admin</option> */}
                    <option value="Supervisor">Supervisor</option>
                    <option value="Field_User">Field User</option>
                    <option value="HSE_Officer">HSE Officer</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Position <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={jobPosition}
                    onChange={(e) => {
                      setJobPosition(e.target.value);
                      if (errors.jobPosition) setErrors(prev => ({ ...prev, jobPosition: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${
                      errors.jobPosition ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select position</option>
                    <option value="Safety Manager">Safety Manager</option>
                    <option value="Field Supervisor">Field Supervisor</option>
                    <option value="HSE Officer">HSE Officer</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Technician">Technician</option>
                  </select>
                  {errors.jobPosition && (
                    <p className="text-red-500 text-xs mt-1">{errors.jobPosition}</p>
                  )}
                </div>
              </div>

              {/* Microsoft 365 Account Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="createMicrosoftAccount"
                    checked={createMicrosoftAccount}
                    onChange={(e) => setCreateMicrosoftAccount(e.target.checked)}
                    className="w-4 h-4 text-[#C24438] border-gray-300 rounded focus:ring-[#C24438]"
                  />
                  <label htmlFor="createMicrosoftAccount" className="ml-2 text-sm font-medium text-gray-700">
                    Also create Microsoft 365 account for mobile app login
                  </label>
                </div>
                
                {createMicrosoftAccount && (
                  <div className="mt-3 ml-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {/* <span className="font-semibold">📱 Mobile App Access</span>
                      <br /> */}
                      <span className="text-xs">
                        A Microsoft account will be created. The user can use these credentials 
                        to log into your mobile app. A temporary password will be generated.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C24438] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#C24438] border border-transparent rounded-lg hover:bg-[#a03830] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C24438] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};