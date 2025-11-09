import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HistoryItem } from '../types';
import { useTranslation, type Language } from '../i18n';

interface HistorySectionProps {
  history: HistoryItem[];
  language: Language;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onViewItem: (item: HistoryItem) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  language,
  onDeleteItem,
  onClearAll,
  onViewItem
}) => {
  const [filter, setFilter] = useState<'all' | 'defects' | 'clean'>('all');
  const t = useTranslation(language);


  const filteredHistory = history.filter(item => {
    if (filter === 'defects') return item.defects_found;
    if (filter === 'clean') return !item.defects_found;
    return true;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (history.length === 0) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('history.title')}</h3>
          <p className="text-gray-500">{t('history.empty')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center sm:text-left">{t('history.title')}</h3>
          
          <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4">
            {/* Filters */}
            <div className="flex items-center space-x-2 flex-wrap justify-center">
              {(['all', 'defects', 'clean'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                    filter === filterType
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {t(`history.filters.${filterType}`)}
                </button>
              ))}
            </div>

            {/* Clear All Button */}
            <button
              onClick={onClearAll}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              {t('history.clearAll')}
            </button>
          </div>
        </div>

        {/* History Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-card shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* Image Preview */}
              <div className="relative h-48 overflow-hidden rounded-t-card">
                <img
                  src={item.original_image}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  item.defects_found
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {item.defects_found ? t('history.defectsFound') : t('history.noDefects')}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-2 truncate">
                  {item.filename}
                </h4>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <ClockIcon className="h-4 w-4" />
                  <span>{formatDate(item.timestamp)}</span>
                </div>

                {/* Defect Summary */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {item.defects_found ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                    <span className="text-sm font-medium">
                      {item.defect_count} {t('history.defects')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewItem(item)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>{t('history.view')}</span>
                  </button>
                  
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {t('history.noResultsForFilter')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorySection;