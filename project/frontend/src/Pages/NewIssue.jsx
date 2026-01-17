// src/Pages/NewIssue.jsx
import { useState } from 'react';
import CharacterCounter from '../components/ui/CharacterCounter';
import SubmissionConfirmation from '../components/modals/SubmissionConfirmation';

export default function NewIssue() {
  const [description, setDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic...
    setShowConfirmation(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <form onSubmit={handleSubmit}>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
          rows={5}
        />
        <CharacterCounter value={description} />
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Submit Issue
        </button>
      </form>

      <SubmissionConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        issueId={123} // Dynamic in real app
        onViewIssue={() => window.location.href = `/issues/123`}
        onReportAnother={() => setDescription('')}
      />
    </div>
  );
}