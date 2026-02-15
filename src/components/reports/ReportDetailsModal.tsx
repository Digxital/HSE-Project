import React, { useState } from 'react';
import { AddActionModal } from './AddActionModal';

interface Action {
  id: string;
  action: string;
  assignedTo: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Completed';
}

interface Report {
  id: string;
  type: 'Incident' | 'Hazard';
  category: string;
  location: string;
  risk: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Closed';
  dateReported: string;
  actions: Action[];
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
  report: Report | null;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, onCloseReport, onAddAction, report }) => {
  const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false);

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
            
            {/* Conditional Close Report Button / Closed Badge */}
            {report.status === 'Closed' ? (
              <div className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm flex items-center gap-2">
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Loose Handrail on Deck</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Lorem ipsum dolor sit amet consectetur. Augue mauris sed velit volputpat dolor et cursds. Posuere risus imperdiet egestas neque vierra. Quisque vel rutrum nullam neque nisi urna. Mauris vitae dolor nisi nisi etiam.
            </p>
          </div>

          {/* Report Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Report type</span>
              <span className="text-sm font-medium text-gray-900">{report.category}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Reported</span>
              <span className="text-sm font-medium text-gray-900">{report.dateReported.replace('\n', ' ')}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Submitted by</span>
              <span className="text-sm font-medium text-gray-900">Field User</span>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Attachments</h3>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Assessment</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Severity</span>
                <span className="text-lg font-semibold text-red-500">8/4</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Likelihood</span>
                <span className="text-lg font-semibold text-orange-500">4/5</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Risk Score</span>
                <span className="text-lg font-semibold text-orange-500">32</span>
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
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
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
