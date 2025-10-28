
import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface OutputCardProps {
  title: string;
  content: string;
}

const OutputCard: React.FC<OutputCardProps> = ({ title, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 relative">
       <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          className={`p-2 rounded-md transition-colors duration-200 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        >
          {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
        </button>
      </div>
      <h3 className="text-lg font-semibold text-green-400 mb-2">{title}</h3>
      <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{content}</p>
    </div>
  );
};

export default OutputCard;
