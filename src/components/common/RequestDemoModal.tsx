import React, { useState } from 'react';
import api from '@/lib/axios';
import { useToast } from '@/hooks/useToast';

interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoFormState {
  firstName: string;
  lastName: string;
  workEmail: string;
  phoneNumber: string;
  company: string;
  jobTitle: string;
  country: string;
  comments: string;
}

const initialFormState: DemoFormState = {
  firstName: '',
  lastName: '',
  workEmail: '',
  phoneNumber: '',
  company: '',
  jobTitle: '',
  country: '',
  comments: '',
};

export const RequestDemoModal: React.FC<RequestDemoModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState<DemoFormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof DemoFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof DemoFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof DemoFormState, string>> = {};

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!form.workEmail.trim()) {
      newErrors.workEmail = 'Work email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.workEmail)) {
      newErrors.workEmail = 'Enter a valid email address';
    }

    if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!form.company.trim()) newErrors.company = 'Company / organization is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetAndClose = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/api/demo-request', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.workEmail.trim(),
        phone: form.phoneNumber.trim(),
        company: form.company.trim(),
        jobTitle: form.jobTitle.trim(),
        country: form.country.trim(),
        message: form.comments.trim(),
      });

      showToast({
        type: 'success',
        message: "Demo request sent! Our team will reach out to you shortly.",
      });
      resetAndClose();
    } catch (error) {
      console.error('Demo request failed:', error);
      showToast({
        type: 'error',
        message: 'Failed to send your demo request. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof DemoFormState) =>
    `w-full px-4 py-3 bg-[#FFF4E64D] text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-[#C2410C]'
    }`;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      onClick={resetAndClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-6 right-6 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title & Subtitle */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">Request a Full Demo</h2>
        <p className="text-sm text-gray-600 mb-6">
          Fill in your details below and our team will reach out to you shortly.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-900 mb-2">First Name *</label>
              <input
                type="text"
                placeholder="Enter your first name"
                className={inputClass('firstName')}
                value={form.firstName}
                onChange={handleChange('firstName')}
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-900 mb-2">Last Name *</label>
              <input
                type="text"
                placeholder="Enter your last name"
                className={inputClass('lastName')}
                value={form.lastName}
                onChange={handleChange('lastName')}
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Work Email & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-900 mb-2">Work Email *</label>
              <input
                type="email"
                placeholder="Enter your work email"
                className={inputClass('workEmail')}
                value={form.workEmail}
                onChange={handleChange('workEmail')}
              />
              {errors.workEmail && <p className="text-xs text-red-500 mt-1">{errors.workEmail}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-900 mb-2">Phone Number *</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className={inputClass('phoneNumber')}
                value={form.phoneNumber}
                onChange={handleChange('phoneNumber')}
              />
              {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>

          {/* Company / Organization */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-900 mb-2">Company / Organization *</label>
            <input
              type="text"
              placeholder="Enter your company or organization"
              className={inputClass('company')}
              value={form.company}
              onChange={handleChange('company')}
            />
            {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
          </div>

          {/* Job Title & Country / Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-900 mb-2">Job Title</label>
              <input
                type="text"
                placeholder="Enter your job title"
                className={inputClass('jobTitle')}
                value={form.jobTitle}
                onChange={handleChange('jobTitle')}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-900 mb-2">Country / Region</label>
              <input
                type="text"
                placeholder="Enter your country or region"
                className={inputClass('country')}
                value={form.country}
                onChange={handleChange('country')}
              />
            </div>
          </div>

          {/* Additional Comments */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-900 mb-2">Additional Comments / Requirements</label>
            <textarea
              placeholder="Tell us more about what you're looking for"
              rows={4}
              className={`${inputClass('comments')} resize-none`}
              value={form.comments}
              onChange={handleChange('comments')}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-4 bg-[#200500] hover:bg-[#1a0400] disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Your details will only be used to contact you regarding your demo request.
          </p>
        </form>
      </div>
    </div>
  );
};
