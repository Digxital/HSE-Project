import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackCategory = 'general' | 'bug' | 'feltOff';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    // In real app, send to backend
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setSelectedCategory(null);
    setNote('');
    setIsSubmitted(false);
    onClose();
  };

  const categories = [
    { id: 'general' as FeedbackCategory, label: 'General Experience', icon: '⭐' },
    { id: 'bug' as FeedbackCategory, label: 'Report a Bug', icon: '🐛' },
    { id: 'feltOff' as FeedbackCategory, label: 'Something Felt Off', icon: '😕' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg p-6 md:p-8 pt-10 md:pt-8 relative transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-1">How's your Aegix Experience?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you satisfied with the service?</p>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-2 rounded-full hover:bg-orange-50 transition-colors"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-orange-400 fill-orange-400'
                        : 'text-gray-300'
                    }`}
                    fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Tell us what can be improved:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add a note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Aegix was amazing! I love this product!"
                rows={4}
                className="w-full px-4 py-3 bg-[#FFF9F5] border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`w-full py-3.5 rounded-lg font-medium transition-colors ${
                rating > 0
                  ? 'bg-[#C24438] hover:bg-[#A63830] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Now
            </button>
          </>
        ) : (
          <>
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="text-center text-lg font-semibold text-gray-900 mb-2">Feedback Submitted!</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              Thank you for your feedback. We appreciate your input and will use it to improve Aegix.
            </p>

            {/* Done Button */}
            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#C24438] hover:bg-[#A63830] text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};
