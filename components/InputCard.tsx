
import React from 'react';
import Spinner from './Spinner';

interface InputCardProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onRefine: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

const InputCard: React.FC<InputCardProps> = ({ value, onChange, onRefine, isLoading, isDisabled }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Step 1: Paste Your Article</h2>
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Paste a news article from FierceBiotech or another source here..."
        className="flex-grow w-full p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 resize-none text-gray-200 disabled:bg-gray-700/50 disabled:cursor-not-allowed"
        rows={20}
        disabled={isDisabled || isLoading}
      />
      <button
        onClick={onRefine}
        disabled={isLoading || !value.trim() || isDisabled}
        className="mt-4 w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg"
      >
        {isLoading ? <Spinner text="Refining..." small={true}/> : 'Refine Article'}
      </button>
    </div>
  );
};

export default InputCard;
