import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  BookmarkIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon
} from '@heroicons/react/24/outline';
import { DefectResponse, DEFECT_TYPES } from '../types';
import { constructImageUrl } from '../config/api';
import { useTranslation, type Language } from '../i18n';

interface ResultsDisplayProps {
  originalImage: string;
  results: DefectResponse;
  language: Language;
  onSaveToHistory: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  originalImage, 
  results, 
  language,
  onSaveToHistory 
}) => {
  const [zoom, setZoom] = useState(1);
  const [showOriginal, setShowOriginal] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const t = useTranslation(language);


  const defectCounts = results.defects.predictions.reduce((acc, pred) => {
    acc[pred.defect_type] = (acc[pred.defect_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDefects = results.defects.predictions.length;

  const getQualityGrade = () => {
    if (totalDefects === 0) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-50' };
    if (totalDefects <= 2) return { grade: 'B', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (totalDefects <= 5) return { grade: 'C', color: 'text-orange-500', bg: 'bg-orange-50' };
    return { grade: 'D', color: 'text-red-500', bg: 'bg-red-50' };
  };

  const qualityGrade = getQualityGrade();

  // Construct full URL for result image
  const getResultImageUrl = () => {
    if (!results.result_image_url) return originalImage;
    const url = constructImageUrl(results.result_image_url);
    console.log('Constructed result image URL:', url);
    return url;
  };

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8"
        >
          {t('results.title')}
        </motion.h3>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Image Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Image Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex space-x-2 justify-center sm:justify-start">
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showOriginal 
                      ? 'bg-gray-200 text-gray-700' 
                      : 'bg-primary-100 text-primary-700'
                  }`}
                >
                  {showOriginal ? t('results.original') : t('results.analyzed')}
                </button>
              </div>
              
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <MagnifyingGlassMinusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <MagnifyingGlassPlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="bg-white rounded-card shadow-sm border overflow-hidden">
              <div className="relative overflow-auto max-h-64 sm:max-h-80 lg:max-h-96">
                {!showOriginal && imageLoadError ? (
                  <div className="flex items-center justify-center h-64 bg-gray-100 text-gray-500">
                    <div className="text-center">
                      <p className="mb-2">❌ {t('results.imageLoadFailed')}</p>
                      <button 
                        onClick={() => setShowOriginal(true)}
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        {t('results.viewOriginalInstead')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={showOriginal ? originalImage : getResultImageUrl()}
                    alt={showOriginal ? t('results.original') : t('results.analyzed')}
                    className="w-full h-auto transition-transform duration-200"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                    onLoad={() => setImageLoadError(false)}
                    onError={(e) => {
                      console.error('Failed to load result image:', getResultImageUrl());
                      setImageLoadError(true);
                      // Fallback to original image if result image fails to load
                      if (!showOriginal) {
                        e.currentTarget.src = originalImage;
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className={`p-6 rounded-card shadow-sm border ${
              results.defects.defects_found 
                ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' 
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                {results.defects.defects_found ? (
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                ) : (
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                )}
                <div>
                  <h4 className={`text-lg font-semibold ${
                    results.defects.defects_found ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {results.defects.defects_found ? t('results.defectsFound') : t('results.noDefects')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {totalDefects} {t('results.defectsDetected')}
                  </p>
                </div>
              </div>

              {/* Quality Grade */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{t('results.qualityGrade')}</span>
                <div className={`px-3 py-1 rounded-full ${qualityGrade.bg}`}>
                  <span className={`text-lg font-bold ${qualityGrade.color}`}>
                    {qualityGrade.grade}
                  </span>
                </div>
              </div>
            </div>

            {/* Defect Types */}
            {results.defects.defects_found && (
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-gray-900">{t('results.defectTypes')}</h5>
                
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(defectCounts).map(([defectType, count]) => {
                    const config = DEFECT_TYPES[defectType];
                    if (!config) return null;

                    const predictions = results.defects.predictions.filter(p => p.defect_type === defectType);
                    const avgConf = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

                    return (
                      <motion.div
                        key={defectType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-lg border shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{config.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{t(config.translationKey)}</p>
                              <p className="text-sm text-gray-500">
                                {count} {count === 1 ? t('results.instance') : t('results.instances')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${config.color}`}>
                              {Math.round(avgConf * 100)}%
                            </div>
                            <p className="text-xs text-gray-500">{t('results.confidence')}</p>
                          </div>
                        </div>

                        {/* Confidence Bar */}
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              config.name === 'missing_hole' ? 'from-red-400 to-red-500' :
                              config.name === 'mouse_bite' ? 'from-green-400 to-green-500' :
                              config.name === 'open_circuit' ? 'from-blue-400 to-blue-500' :
                              config.name === 'short_circuit' ? 'from-orange-400 to-orange-500' :
                              config.name === 'spur' ? 'from-purple-400 to-purple-500' :
                              'from-teal-400 to-teal-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${avgConf * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSaveToHistory}
              className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-card font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm text-sm sm:text-base"
            >
              <BookmarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{t('results.saveToHistory')}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;