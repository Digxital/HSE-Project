import React, { useState } from 'react';

interface AddActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAction: (action: {
    actionTitle: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    description: string;
  }) => void;
}

export const AddActionModal: React.FC<AddActionModalProps> = ({ isOpen, onClose, onAddAction }) => {
  const [formData, setFormData] = useState({
    actionTitle: '',
    assignedTo: '',
    dueDate: '',
    priority: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Add styles to hide scrollbar
  const modalRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (modalRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.actionTitle.trim()) {
      newErrors.actionTitle = 'Action title is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please select who to assign this action to';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Please select a priority level';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddAction(formData);
      // Reset form
      setFormData({
        actionTitle: '',
        assignedTo: '',
        dueDate: '',
        priority: '',
        description: '',
      });
      setErrors({});
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Container - positioned to center in right side of screen */}
      <div className="fixed inset-0 flex items-center justify-center md:justify-end pr-0 md:pr-8 lg:pr-16 pt-16 pointer-events-none z-[60]">
        {/* Modal */}
        <div
          ref={modalRef}
          className={`bg-[#FFFAF5] rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto hide-scrollbar transform transition-all duration-300 mx-4 pointer-events-auto ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="p-6 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 p-1 hover:bg-[#FFF9F5] rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Add Action</h2>
              <p className="text-sm text-gray-500">Authorized access only</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Action Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Title</label>
                <input
                  type="text"
                  value={formData.actionTitle}
                  onChange={(e) => handleChange('actionTitle', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border ${
                    errors.actionTitle ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm`}
                  placeholder="Enter action title"
                />
                {errors.actionTitle && <p className="mt-1 text-xs text-red-500">{errors.actionTitle}</p>}
              </div>

              {/* Assigned to */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned to</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border ${
                    errors.assignedTo ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm appearance-none cursor-pointer`}
                >
                  <option value="">Select team</option>
                  <option value="Maintenance Lead">Maintenance Lead</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Technical Lead">Technical Lead</option>
                  <option value="Field Engineer">Field Engineer</option>
                  <option value="Safety Manager">Safety Manager</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Operations Team">Operations Team</option>
                </select>
                {errors.assignedTo && <p className="mt-1 text-xs text-red-500">{errors.assignedTo}</p>}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm`}
                />
                {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border ${
                    errors.priority ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm appearance-none cursor-pointer`}
                >
                  <option value="">Select</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-2.5 bg-white border ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm resize-none`}
                  placeholder="Enter description"
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#C24438] hover:bg-[#a03830] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Create Action
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
