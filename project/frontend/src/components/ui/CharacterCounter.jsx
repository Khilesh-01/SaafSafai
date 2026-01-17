// src/components/ui/CharacterCounter.jsx
export default function CharacterCounter({ value, maxLength = 500 }) {
  const count = value.length;
  const percentage = Math.min((count / maxLength) * 100, 100);

  const getColor = () => {
    if (count > maxLength) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-500'; 
    return 'text-gray-500';
  };

  return (
    <div className={`text-xs ${getColor()} text-right mt-1`}>
      {count}/{maxLength} {count > maxLength && '(Over limit)'}
    </div>
  );
}