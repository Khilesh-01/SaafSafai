// src/Pages/IssueDetail.jsx
import CopyLinkButton from '../components/ui/CopyLinkButton';

export default function IssueDetail() {
  // Fetch issue data here...
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Issue Title</h1>
        <CopyLinkButton />
      </div>
      {/* Rest of issue details */}
    </div>
  );
}