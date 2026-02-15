import React, { useState } from 'react';

type ActionStatus = 'Open' | 'In Progress' | 'Completed' | 'Closed';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface ActionDetails {
  id: string;
  title: string;
  description: string;
  reportId: string;
  assignedTo: string;
  status: ActionStatus;
  createdOn: string;
  dueDate: string;
  comments: string;
  timeline: TimelineEvent[];
}

interface ActionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: ActionDetails | null;
  onMarkCompleted?: (actionId: string) => void;
  onVerifyClose?: (actionId: string) => void;
  onReopen?: (actionId: string) => void;
}

export const ActionDetailsModal: React.FC<ActionDetailsModalProps> = ({
  isOpen,
  onClose,
  action,
  onMarkCompleted,
  onVerifyClose,
  onReopen,
}) => {
  const [comments, setComments] = useState(action?.comments || '');

  if (!action) return null;

  const getStatusColor = (status: ActionStatus) => {
    const colors = {
      Open: 'text-[#FF3B30]',
      'In Progress': 'text-[#FF9500]',
      Completed: 'text-[#34C759]',
      Closed: 'text-gray-500',
    };
    return colors[status];
  };

  const isDueDatePast = new Date(action.dueDate) < new Date();

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
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

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

            {action.status !== 'Closed' && action.status !== 'Completed' && (
              <button
                onClick={() => onMarkCompleted?.(action.id)}
                className="px-4 py-2 bg-[#34C759] text-white rounded-lg text-sm font-medium hover:bg-[#2FB350] transition-colors"
              >
                Mark as Completed
              </button>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6">{/* Title & Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h2>
            <p className="text-sm text-gray-600">{action.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Report ID</div>
              <div className="text-sm font-medium text-gray-900">{action.reportId}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Created On</div>
              <div className="text-sm font-medium text-gray-900">{action.createdOn}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Assigned To</div>
              <div className="text-sm font-medium text-gray-900">{action.assignedTo}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Due Date</div>
              <div className={`text-sm font-medium ${isDueDatePast ? 'text-[#FF3B30]' : 'text-gray-900'}`}>
                {action.dueDate}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <div className={`text-sm font-semibold ${getStatusColor(action.status)}`}>{action.status}</div>
            </div>
          </div>

          {/* Evidence & Updates */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Evidence & Updates</h3>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm resize-none"
              rows={4}
              placeholder="Add your comments here..."
            />
          </div>

          {/* Action Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Action Timeline</h3>
            <div className="space-y-4">
              {action.timeline.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-[#C24438] rounded-full mt-1.5" />
                    {index !== action.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-xs text-gray-500 mb-1">{event.date}</div>
                    <div className="text-sm font-semibold text-gray-900 mb-0.5">{event.title}</div>
                    <div className="text-sm text-gray-600">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* Footer Actions */}
        {(action.status === 'Completed' || action.status === 'Closed') && (
          <div className="border-t border-gray-200 p-6 flex gap-3">
            {action.status === 'Completed' ? (
              <>
                <button
                  onClick={() => onReopen?.(action.id)}
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-[#FF3B30] text-[#FF3B30] rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Reopen Action
                </button>
                <button
                  onClick={() => onVerifyClose?.(action.id)}
                  className="flex-1 px-4 py-2.5 bg-[#34C759] text-white rounded-lg text-sm font-medium hover:bg-[#2FB350] transition-colors"
                >
                  Verify & Close
                </button>
              </>
            ) : (
              <button
                onClick={() => onReopen?.(action.id)}
                className="w-full px-4 py-2.5 bg-white border-2 border-[#FF3B30] text-[#FF3B30] rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Reopen Action
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
