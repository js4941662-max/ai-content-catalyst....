
import React from 'react';
import SettingsIcon from './icons/SettingsIcon';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                AI Content Catalyst
            </span>
            </h1>
            <p className="text-gray-400 mt-1">
            Refine news into insights. Generate impactful LinkedIn posts.
            </p>
        </div>
        <div className="flex-1 flex justify-end">
            <button
                onClick={onOpenSettings}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                aria-label="Manage API Keys"
            >
                <SettingsIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
