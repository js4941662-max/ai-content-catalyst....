
import React, { useState } from 'react';
import { refineArticle, generateLinkedInPost } from './services/geminiService';
import Header from './components/Header';
import InputCard from './components/InputCard';
import OutputCard from './components/OutputCard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [originalArticle, setOriginalArticle] = useState<string>('');
  const [refinedArticle, setRefinedArticle] = useState<string>('');
  const [linkedinPost, setLinkedinPost] = useState<string>('');
  const [isLoadingRefined, setIsLoadingRefined] = useState<boolean>(false);
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefineArticle = async () => {
    if (!originalArticle.trim()) {
      setError('Please paste an article first.');
      return;
    }
    setError(null);
    setIsLoadingRefined(true);
    setRefinedArticle('');
    setLinkedinPost('');

    try {
      const result = await refineArticle(originalArticle);
      setRefinedArticle(result);
    } catch (err) {
      setError('Failed to refine the article. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingRefined(false);
    }
  };

  const handleGeneratePost = async () => {
    if (!refinedArticle.trim()) {
      setError('Please refine an article first.');
      return;
    }
    setError(null);
    setIsLoadingPost(true);
    setLinkedinPost('');
    
    try {
      const result = await generateLinkedInPost(refinedArticle);
      setLinkedinPost(result);
    } catch (err) {
      setError('Failed to generate LinkedIn post. Please try again.');
      console.error(err);
    } finally {
      setIsLoadingPost(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputCard 
            value={originalArticle}
            onChange={(e) => setOriginalArticle(e.target.value)}
            onRefine={handleRefineArticle}
            isLoading={isLoadingRefined}
          />

          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Step 2: Refined Article</h2>
              {isLoadingRefined && <Spinner text="Refining article..." />}
              {refinedArticle && (
                <>
                  <OutputCard title="Refined Content" content={refinedArticle} />
                  <button 
                    onClick={handleGeneratePost}
                    disabled={isLoadingPost}
                    className="mt-4 w-full flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg"
                  >
                    {isLoadingPost ? <Spinner text="Generating..." small={true}/> : 'Generate LinkedIn Post'}
                  </button>
                </>
              )}
               {!isLoadingRefined && !refinedArticle && <p className="text-gray-400">Your refined article will appear here.</p>}
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Step 3: The Unbeatable Post</h2>
              {isLoadingPost && <Spinner text="Generating post..." />}
              {linkedinPost && (
                <OutputCard title="Final Post" content={linkedinPost} />
              )}
              {!isLoadingPost && !linkedinPost && <p className="text-gray-400">The generated LinkedIn post will appear here.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
