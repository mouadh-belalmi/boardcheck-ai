import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadInterface from './components/UploadInterface';
import LoadingSpinner from './components/LoadingSpinner';
import { ApiService } from './services/api';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DefectResponse, HistoryItem } from './types';
import { useTranslation, type Language } from './i18n';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useToast } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load heavy components
const ResultsDisplay = lazy(() => import('./components/ResultsDisplay'));
const HistorySection = lazy(() => import('./components/HistorySection'));

type AppState = 'upload' | 'analyzing' | 'results' | 'history';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('analysis_history', []);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentResults, setCurrentResults] = useState<DefectResponse | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const isArabic = language === 'ar';
  const t = useTranslation(language);
  const { showToast, ToastContainer } = useToast();

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    setCurrentFile(file);
    setError(null);
    setState('analyzing');

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setCurrentImageUrl(imageUrl);

    try {
      // Validate image first
      if (!ApiService.validateImage(file)) {
        throw new Error(t('errors.invalidFile'));
      }

      const results = await ApiService.detectDefects(file);
      setCurrentResults(results);
      setState('results');
    } catch (error: unknown) {
      console.error('Analysis error:', error);
      
      // Use the same error handling as Flutter version
      const errorMessage = getLocalizedError(error instanceof Error ? error.message : String(error));
      setError(errorMessage);
      setState('upload');
    }
  }, [t]);

  const getLocalizedError = useCallback((errorString: string) => {
    if (errorString.includes('Network connection failed')) {
      return t('errors.networkConnectionFailed');
    } else if (errorString.includes('timed out') || errorString.includes('timeout')) {
      return t('errors.requestTimedOut');
    } else if (errorString.includes('Server error')) {
      return t('errors.serverErrorRetry');
    } else if (errorString.includes('too large')) {
      return t('errors.fileTooLarge');
    } else if (errorString.includes('Invalid image format')) {
      return t('errors.invalidImageFormat');
    } else if (errorString.includes('not found')) {
      return t('errors.imageNotFound');
    } else {
      return t('errors.unexpectedError');
    }
  }, [t]);

  const handleSaveToHistory = useCallback(() => {
    if (!currentFile || !currentResults) return;

    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      filename: currentFile.name,
      defects_found: currentResults.defects.defects_found,
      defect_count: currentResults.defects.predictions.length,
      original_image: currentImageUrl,
      result_image: currentResults.result_image_url,
      predictions: currentResults.defects.predictions
    };

    setHistory(prev => [historyItem, ...prev]);
    
    // Show success feedback
    showToast(t('success.analysisSaved'), 'success');
  }, [currentFile, currentResults, currentImageUrl, setHistory, t, showToast]);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, [setHistory]);

  const handleClearHistory = useCallback(() => {
    if (window.confirm(t('confirmations.clearHistory'))) {
      setHistory([]);
    }
  }, [setHistory, t]);

  const handleViewHistoryItem = useCallback((item: HistoryItem) => {
    // Recreate the results structure from history item
    const results: DefectResponse = {
      defects: {
        defects_found: item.defects_found,
        predictions: item.predictions
      },
      result_image_url: item.result_image
    };

    setCurrentResults(results);
    setCurrentImageUrl(item.original_image);
    setState('results');
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setCurrentFile(null);
    setCurrentResults(null);
    setCurrentImageUrl('');
    setError(null);
    setState('upload');
  }, []);

  const handleShowHistory = useCallback(() => {
    setState('history');
  }, []);

  const handleRetry = useCallback(() => {
    if (currentFile) {
      handleFileSelect(currentFile);
    } else {
      setState('upload');
    }
  }, [currentFile, handleFileSelect]);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-background ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Header 
        language={language}
        onLanguageChange={setLanguage}
        historyCount={history.length}
      />

      {/* Navigation Breadcrumbs */}
      {(state === 'results' || state === 'history') && (
        <nav className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Breadcrumb">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setState('upload')}
              className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isArabic ? 'flex-row-reverse space-x-reverse' : ''
              }`}
              aria-label={`${t('actions.back')} to upload page`}
            >
              {isArabic ? (
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{t('actions.back')}</span>
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1" role="main">
        <AnimatePresence mode="wait">
          {state === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero language={language} />
              <UploadInterface 
                onFileSelect={handleFileSelect}
                isAnalyzing={false}
                language={language}
              />
              
              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto px-4 mb-8"
                >
                  <div className="bg-red-50 border border-red-200 rounded-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-red-700">{error}</p>
                      <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        {t('actions.retry')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* History Preview */}
              {history.length > 0 && (
                <div className="text-center py-8">
                  <button
                    onClick={handleShowHistory}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-card font-medium hover:bg-gray-200 transition-colors"
                  >
                    <span>{t('actions.viewHistory')}</span>
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {history.length}
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {state === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero language={language} />
              <UploadInterface 
                onFileSelect={handleFileSelect}
                isAnalyzing={true}
                language={language}
              />
            </motion.div>
          )}

          {state === 'results' && currentResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={
                <div className="flex justify-center items-center py-20">
                  <LoadingSpinner size="lg" text={t('upload.analyzing')} />
                </div>
              }>
                <ResultsDisplay 
                  originalImage={currentImageUrl}
                  results={currentResults}
                  language={language}
                  onSaveToHistory={handleSaveToHistory}
                />
              </Suspense>
              
              {/* Action Buttons */}
              <div className="text-center py-6 sm:py-8 px-4">
                <div className="flex flex-col xs:flex-row justify-center gap-3 xs:gap-4 max-w-md mx-auto">
                  <button
                    onClick={handleNewAnalysis}
                    className="flex-1 xs:flex-initial px-4 sm:px-6 py-3 bg-primary-500 text-white rounded-card font-medium hover:bg-primary-600 transition-colors text-sm sm:text-base"
                  >
                    {t('actions.newAnalysis')}
                  </button>
                  <button
                    onClick={handleShowHistory}
                    className="flex-1 xs:flex-initial px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-card font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    {t('actions.viewHistory')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={
                <div className="flex justify-center items-center py-20">
                  <LoadingSpinner size="lg" text={t('history.title')} />
                </div>
              }>
                <HistorySection
                  history={history}
                  language={language}
                  onDeleteItem={handleDeleteHistoryItem}
                  onClearAll={handleClearHistory}
                  onViewItem={handleViewHistoryItem}
                />
              </Suspense>
              
              {/* Back Button */}
              <div className="text-center py-6 sm:py-8 px-4">
                <button
                  onClick={handleNewAnalysis}
                  className="px-4 sm:px-6 py-3 bg-primary-500 text-white rounded-card font-medium hover:bg-primary-600 transition-colors text-sm sm:text-base"
                >
                  {t('actions.newAnalysis')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4" role="contentinfo">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
    </ErrorBoundary>
  );
}

export default App;