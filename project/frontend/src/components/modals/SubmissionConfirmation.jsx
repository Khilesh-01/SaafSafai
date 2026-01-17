// src/components/modals/SubmissionConfirmation.jsx
import { FiCheckCircle, FiX, FiExternalLink } from 'react-icons/fi';

export default function SubmissionConfirmation({ 
  isOpen, 
  onClose, 
  issueId,
  onViewIssue,
  onReportAnother 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start">
          <FiCheckCircle className="text-green-500 text-4xl" />
          <button onClick={onClose} aria-label="Close">
            <FiX className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold mt-2 dark:text-white">Issue Reported!</h3>
        <p className="mt-2 dark:text-gray-300">Your issue ID: #{issueId}</p>

        <div className="mt-6 flex gap-3">
          <button 
            onClick={onViewIssue}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <FiExternalLink /> View Issue
          </button>
          <button 
            onClick={onReportAnother}
            className="flex-1 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded"
          >
            Report Another
          </button>
        </div>
      </div>
    </div>
  );
}