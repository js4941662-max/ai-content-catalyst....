
import React, { useState, useCallback } from 'react';
import { refineArticle, generateLinkedInPost } from './services/geminiService';
import Header from './components/Header';
import InputCard from './components/InputCard';
import OutputCard from './components/OutputCard';
import Spinner from './components/Spinner';
import ApiKeyModal from './components/ApiKeyModal';

const initialArticle = `Headline: Novartis Doubles Down on Radioligand Therapy, Announcing Phase 3 Success for Pluvicto in Earlier Prostate Cancer Setting

ZURICH, Switzerland – Novartis today announced positive top-line results from the pivotal Phase 3 PSMAfore trial, showing that Pluvicto™ (lutetium (177Lu) vipivotide tetraxetan) met its primary endpoint of radiographic progression-free survival (rPFS) in patients with prostate-specific membrane antigen (PSMA)-positive metastatic castration-resistant prostate cancer (mCRPC) after treatment with an androgen receptor pathway inhibitor (ARPI), prior to receiving taxane-based chemotherapy.

The trial demonstrated a clinically meaningful and statistically significant improvement in rPFS for patients treated with Pluvicto compared to a change in ARPI. The safety profile of Pluvicto in this earlier setting was consistent with its established profile in the post-taxane setting, with no new or unexpected safety signals reported.

This result marks a significant step in Novartis's strategy to establish Pluvicto as a foundational treatment for mCRPC and move radioligand therapies (RLT) into earlier lines of treatment. Pluvicto, a targeted RLT, works by delivering beta-particle radiation directly to PSMA-positive cancer cells, minimizing damage to surrounding healthy tissue.

"These results are a potential paradigm shift," said Dr. Jane Doe, Head of Oncology at Novartis. "Bringing a highly effective targeted therapy like Pluvicto to patients before chemotherapy could significantly alter the treatment landscape for mCRPC. Our ambition is to leverage our deep expertise in RLT to redefine cancer care across multiple tumor types."

Novartis plans to submit these data to regulatory authorities worldwide in the coming months. The company is also investigating Pluvicto in earlier lines of treatment for metastatic prostate cancer, including the pre-taxane and hormone-sensitive settings. The company's broader RLT portfolio includes Lutathera for neuroendocrine tumors and a deep pipeline of investigational therapies targeting various cancers.`;

const App: React.FC = () => {
  const [originalArticle, setOriginalArticle] = useState<string>(initialArticle);
  const [refinedArticle, setRefinedArticle] = useState<string>('');
  const [linkedinPost, setLinkedinPost] = useState<string>('');
  const [isLoadingRefined, setIsLoadingRefined] = useState<boolean>(false);
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
 
  const resetError = () => setError(null);

  const handleRefineArticle = async () => {
    if (!originalArticle.trim()) {
      setError('Please paste an article first.');
      return;
    }
    resetError();
    setIsLoadingRefined(true);
    setRefinedArticle('');
    setLinkedinPost('');

    try {
      const result = await refineArticle(originalArticle);
      setRefinedArticle(result);
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred. Please try again.';
      setError(`Error refining article: ${errorMessage}`);
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
    resetError();
    setIsLoadingPost(true);
    setLinkedinPost('');
    
    try {
      const result = await generateLinkedInPost(refinedArticle);
      setLinkedinPost(result);
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred. Please try again.';
      setError(`Error generating post: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoadingPost(false);
    }
  };
  
  const openModal = useCallback(() => setIsModalOpen(true), []);

  const handleKeysSaved = () => {
    setIsModalOpen(false);
    resetError();
    // No automatic retry, user can click the button again if they wish.
    // This simplifies the logic significantly.
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header onOpenSettings={openModal} />
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
                    className="mt-4 w-full flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg"
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
      <ApiKeyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleKeysSaved}
      />
    </div>
  );
};

export default App;
