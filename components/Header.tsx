
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            AI Content Catalyst
          </span>
        </h1>
        <p className="text-center text-gray-400 mt-1">
          Refine news into insights. Generate impactful LinkedIn posts.
        </p>
      </div>
    </header>
  );
};

export default Header;
