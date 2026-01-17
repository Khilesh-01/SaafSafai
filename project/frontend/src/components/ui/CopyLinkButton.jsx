// src/components/ui/CopyLinkButton.jsx
import { FiCopy } from 'react-icons/fi';
import { useToast } from '../../hooks/useToast';
import { useLocation } from 'react-router-dom';

export default function CopyLinkButton() {
  const { toast } = useToast();
  const location = useLocation();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}${location.pathname}`)
      .then(() => toast.success('Link copied!'))
      .catch(() => toast.error('Failed to copy'));
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
      aria-label="Copy link"
    >
      <FiCopy className="text-gray-600 dark:text-gray-300" />
    </button>
  );
}