import React, { useState } from 'react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (userData: {
    firstName: string;
    surname: string;
    email: string;
    role: string;
    jobPosition: string;
  }) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreateUser,
}) => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [jobPosition, setJobPosition] = useState('');
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

    onCreateUser({
      firstName,
      surname,
      email,
      role,
      jobPosition,
    });

    // Reset form
    setFirstName('');
    setSurname('');
    setEmail('');
    setRole('');
    setJobPosition('');
    setErrors({});
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-6 pb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Create New User</h2>
            <p className="text-sm text-gray-500">Add a field user or supervisor to the system</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <div className="space-y-4">
              {/* First Name and Surname */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) {
                        setErrors(prev => ({ ...prev, firstName: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder=""
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Surname</label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => {
                      setSurname(e.target.value);
                      if (errors.surname) {
                        setErrors(prev => ({ ...prev, surname: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${
                      errors.surname ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder=""
                  />
                  {errors.surname && (
                    <p className="text-red-500 text-xs mt-1">{errors.surname}</p>
                  )}
                </div>
              </div>

              {/* Email and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder=""
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (errors.role) {
                        setErrors(prev => ({ ...prev, role: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-gray-700 bg-white ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Choose role</option>
                    <option value="Admin">Admin</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Field User">Field User</option>
                    <option value="HSE Officer">HSE Officer</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
              </div>

              {/* Job Position */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Job Position</label>
                <select
                  value={jobPosition}
                  onChange={(e) => {
                    setJobPosition(e.target.value);
                    if (errors.jobPosition) {
                      setErrors(prev => ({ ...prev, jobPosition: '' }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-gray-700 bg-white ${
                    errors.jobPosition ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose position</option>
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#C24438] hover:bg-[#a03830] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-6"
              >
                <span>Send Email Invitation</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
