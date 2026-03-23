import { AddActionModal } from '@/components/reports/AddActionModal';
import React, { useState } from 'react';


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
  role: 'Admin' | 'Supervisor';
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
  report: Report | null;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, onCloseReport, onAddAction, onAddComment, report }) => {
  const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

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
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[680px] bg-[#FFFAF5] shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 md:p-6">
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
            
            {/* Conditional Close Report Button / Closed Badge */}
            {report.status === 'Closed' ? (
              <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Closed
              </div>
            ) : (
              <button
                onClick={() => onCloseReport(report.id)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{report.category}</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {report.description}
            </p>
          </div>

          {/* Report Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Report type</span>
              <span className="text-sm font-medium text-gray-900">{report.type}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Location</span>
              <span className="text-sm font-medium text-gray-900">{report.location}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Reported</span>
              <span className="text-sm font-medium text-gray-900">{report.dateReported.replace('\n', ' ')}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Submitted by</span>
              <span className="text-sm font-medium text-gray-900">{report.reportedBy}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Equipment involved</span>
              <span className="text-sm font-medium text-gray-900">{report.equipmentInvolved}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`text-sm font-medium ${
                report.status === 'Open' ? 'text-red-500' :
                report.status === 'In Progress' ? 'text-orange-500' :
                'text-gray-500'
              }`}>{report.status}</span>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Attachments</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No attachments</p>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Assessment</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Risk Level</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  report.risk === 'High' ? 'bg-red-500 text-white' :
                  report.risk === 'Medium' ? 'bg-orange-500 text-white' :
                  'bg-green-500 text-white'
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
                <h3 className="text-sm font-semibold text-gray-900">Corrective Actions</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Actions created from this report ({report.actions.length} total)
                </p>
              </div>
              {/* Add Action Button - Only show for non-closed reports */}
              {report.status !== 'Closed' && (
                <button
                  onClick={() => setIsAddActionModalOpen(true)}
                  className="px-4 py-2 bg-[#C24438] hover:bg-[#a03830] text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Action
                </button>
              )}
            </div>
            
            {report.actions.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead className="bg-[#FFF9F5] border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Assigned to</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.actions.map((action) => (
                      <tr key={action.id} className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors border-l-4 border-l-[#C24438] border-b border-b-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">{action.action}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{action.assignedTo}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{action.dueDate}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              action.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : action.status === 'In Progress'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
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
              <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 text-center mb-1">No actions created yet.</p>
                <p className="text-xs text-gray-400 text-center">
                  Click "Add Action" Button to create corrective actions for this report
                </p>
              </div>
            ) : null}
          </div>

          {/* Comments Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments</h3>

            {/* Comment Input */}
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent resize-none"
                rows={3}
                placeholder="Add a comment..."
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-[#C24438] hover:bg-[#a03830] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Add Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            {report.comments && report.comments.length > 0 ? (
              <div className="space-y-3">
                {report.comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                      <div className="w-7 h-7 bg-[#C24438] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {comment.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        comment.role === 'Admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {comment.role}
                      </span>
                      <span className="text-xs text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No comments yet</p>
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
