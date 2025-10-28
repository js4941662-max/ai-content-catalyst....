
import React from 'react';

interface SpinnerProps {
    text?: string;
    small?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ text = "Loading...", small = false }) => {
  const spinnerSize = small ? 'h-5 w-5' : 'h-8 w-8';
  const textSize = small ? 'text-md' : 'text-xl';
  const containerClass = small ? 'flex items-center justify-center space-x-2' : 'flex flex-col items-center justify-center space-y-2 p-4';

  return (
    <div className={containerClass}>
      <div 
        className={`${spinnerSize} animate-spin rounded-full border-4 border-solid border-cyan-400 border-t-transparent`}
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className={`${textSize} text-gray-300`}>{text}</p>}
    </div>
  );
};

export default Spinner;
