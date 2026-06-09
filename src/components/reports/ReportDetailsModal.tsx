import React, { useEffect, useState } from 'react';
import { AddActionModal } from './AddActionModal';
 
interface Action {
  id: string;
  action: string;
  assignedTo: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Completed';
}

interface Comment {
  id: string;
  author: string;
  role: 'Admin' | 'Supervisor' | 'Field User';
  text: string;
  timestamp: string;
}

interface Report {
  id: string;
  type: 'Incident' | 'Hazard';
  category: string;
  description: string;
  location: string;
  risk: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Closed';
  dateReported: string;
  reportedBy: string;
  equipmentInvolved: string;
  actions: Action[];
  comments: Comment[];
}

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseReport: (reportId: string) => void;
  onAddAction: (reportId: string, action: {
    actionTitle: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    description: string;
  }) => void;
  onAddComment: (reportId: string, text: string) => void;
  onDeleteComment: (reportId: string, commentId: string) => void;
  report: Report | null;
  highlightCommentId?: string;
  canDeleteComments?: boolean;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, onCloseReport, onAddAction, onAddComment, onDeleteComment, report, highlightCommentId, canDeleteComments = false }) => {
  const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const formatDueDate = (dateValue: string) => {
    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    }
    return dateValue;
  };

  useEffect(() => {
    if (!isOpen || !highlightCommentId) return;
    const elementId = `comment-${highlightCommentId}`;
    const target = document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightCommentId, isOpen, report?.comments]);

  const handleAddAction = (actionData: {
    actionTitle: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    description: string;
  }) => {
    if (report) {
      onAddAction(report.id, actionData);
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim() && report) {
      onAddComment(report.id, newComment.trim());
      setNewComment('');
    }
  };

  if (!report) return null;

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
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[680px] bg-[#fffaf5] dark:bg-[#121212] shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            {/* Conditional Close Report Button / Closed Badge */}
            {report.status === 'Closed' ? (
              <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Closed
              </div>
            ) : (
              <button
                onClick={() => onCloseReport(report.id)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Close Report
              </button>
            )}
          </div>

          {/* Report Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{report.category}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {report.description}
            </p>
          </div>

          {/* Report Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Report type</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{report.type}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{report.location}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Reported</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{report.dateReported.replace('\n', ' ')}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Submitted by</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{report.reportedBy}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Equipment involved</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{report.equipmentInvolved}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className={`text-sm font-medium ${
                report.status === 'Open' ? 'text-red-500 dark:text-red-400' :
                report.status === 'In Progress' ? 'text-orange-500 dark:text-orange-400' :
                'text-gray-500 dark:text-gray-400'
              }`}>{report.status}</span>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Attachments</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No attachments</p>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Risk Assessment</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  report.risk === 'High' ? 'bg-red-500 dark:bg-red-900/30 text-white dark:text-red-400' :
                  report.risk === 'Medium' ? 'bg-orange-500 dark:bg-orange-900/30 text-white dark:text-orange-400' :
                  'bg-green-500 dark:bg-green-900/30 text-white dark:text-green-400'
                }`}>
                  {report.risk}
                </span>
              </div>
            </div>
          </div>

          {/* Corrective Actions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Corrective Actions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Actions created from this report ({report.actions.length} total)
                </p>
              </div>
              {/* Add Action Button - Only show for non-closed reports */}
              {report.status !== 'Closed' && (
                <button
                  onClick={() => setIsAddActionModalOpen(true)}
                  className="px-4 py-2 bg-[#f87171] dark:bg-[#9f1212] hover:bg-[#ef4444] dark:hover:bg-[#b81c1c] text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Action
                </button>
              )}
            </div>
            
            {report.actions.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead className="bg-[#FFF9F5] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Assigned to</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.actions.map((action) => (
                      <tr key={action.id} className="bg-[#FFFAF5] dark:bg-gray-800 hover:bg-[#FFFEFB] dark:hover:bg-gray-700 transition-colors border-l-4 border-l-[#C24438] dark:border-l-orange-500 border-b border-b-gray-200 dark:border-b-gray-700">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{action.action}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{action.assignedTo}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{formatDueDate(action.dueDate)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              action.status === 'Completed'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : action.status === 'In Progress'
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}
                          >
                            {action.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : report.status !== 'Closed' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">No actions created yet.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  Click "Add Action" Button to create corrective actions for this report
                </p>
              </div>
            ) : null}
          </div>

          {/* Comments Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Comments</h3>

            {/* Comment Input */}
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C24438] dark:focus:ring-orange-500 focus:border-transparent resize-none transition-colors"
                rows={3}
                placeholder="Add a comment..."
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-[#f87171] dark:bg-[#9f1212] hover:bg-[#ef4444] dark:hover:bg-[#b81c1c] disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Add Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            {report.comments && report.comments.length > 0 ? (
              <div className="space-y-3">
                {report.comments.map((comment) => (
                  <div
                    key={comment.id}
                    id={`comment-${comment.id}`}
                    className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 md:p-4 ${
                      highlightCommentId === comment.id
                        ? 'ring-2 ring-[#C24438] ring-offset-2 ring-offset-[#FFFAF5] dark:ring-offset-[#121212]'
                        : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                      <div className="w-7 h-7 bg-[#f87171] dark:bg-[#9f1212] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {comment.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.author}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        comment.role === 'Admin'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : comment.role === 'Supervisor'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>
                        {comment.role}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{comment.timestamp}</span>
                      {canDeleteComments && (
                        <button
                          onClick={() => onDeleteComment(report.id, comment.id)}
                          className="ml-auto text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Action Modal */}
      <AddActionModal
        isOpen={isAddActionModalOpen}
        onClose={() => setIsAddActionModalOpen(false)}
        onAddAction={handleAddAction}
      />
    </>
  );
};
