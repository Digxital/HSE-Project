import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [rating, setRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'general', label: 'General Experience', icon: '😊' },
    { id: 'bug', label: 'Report a Bug', icon: '🐛' },
    { id: 'issue', label: 'Something Felt Off', icon: '⚠️' },
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = () => {
    if (rating === 0 || selectedCategories.length === 0) return;
    // In real app, send to backend
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setRating(0);
    setSelectedCategories([]);
    setFeedback('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-[#121212] rounded-lg shadow-xl w-[90%] max-w-md p-6 relative transform transition-all duration-300 scale-100 opacity-100 border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Title */}
            <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-1">How's your Aegix Experience?</h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you satisfied with the service?
            </p>

            {/* Star Rating */}
            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  {star <= rating ? (
                    <svg className="w-10 h-10 text-orange-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-600 stroke-current" viewBox="0 0 24 24" fill="none">
                      <path strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tell us what can be improved:</p>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-600'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Textarea */}
            <div className="mb-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full px-4 py-3 bg-[#FFF9F5] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || selectedCategories.length === 0}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                rating > 0 && selectedCategories.length > 0
                  ? 'bg-[#C24438] hover:bg-[#A63830] dark:bg-[#9f1212] dark:hover:bg-[#b81c1c] text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Now
            </button>
          </>
        ) : (
          <>
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-2">Feedback Submitted!</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              Thank you for your feedback. We appreciate your input and will use it to improve Aegix.
            </p>

            {/* Done Button */}
            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#C24438] hover:bg-[#A63830] dark:bg-[#9f1212] dark:hover:bg-[#b81c1c] text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};
