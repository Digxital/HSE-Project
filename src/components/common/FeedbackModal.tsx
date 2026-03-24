import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null; 

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    // In real app, send to backend
    setIsSubmitted(true);
  };

  const handleClose = () => {
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
        className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 relative transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Feedback Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-center text-lg font-semibold text-gray-900 mb-2">Give Feedback</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              Help us improve Aegix. Share your thoughts, suggestions, or report issues.
            </p>

            {/* Feedback Textarea */}
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              rows={4}
              className="w-full px-4 py-3 bg-[#FFF9F5] border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent resize-none mb-4"
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                feedback.trim()
                  ? 'bg-[#C24438] hover:bg-[#A63830] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Feedback
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
