import React, { useState, useEffect } from 'react';
import { CpuChipIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { ApiService } from '../services/api';
import { useTranslation, type Language } from '../i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  historyCount: number;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, historyCount }) => {
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const t = useTranslation(language);

  useEffect(() => {
    const checkServerHealth = async () => {
      setServerStatus('checking');
      const isHealthy = await ApiService.checkHealth();
      setServerStatus(isHealthy ? 'online' : 'offline');
    };

    checkServerHealth();
    const interval = setInterval(checkServerHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <CpuChipIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" aria-hidden="true" />
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              <span className="hidden xs:inline">BoardCheck AI</span>
              <span className="xs:hidden">BCAI</span>
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Server Status */}
            <div className="flex items-center space-x-2" role="status" aria-live="polite">
              <div 
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getStatusColor()} ${
                  serverStatus === 'online' ? 'animate-pulse-slow' : ''
                }`}
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm text-gray-600 hidden md:inline">
                {serverStatus === 'online' ? t('header.serverOnline') : 
                 serverStatus === 'offline' ? t('header.serverOffline') : t('header.checking')}
              </span>
              <span className="sr-only">
                Server status: {serverStatus === 'online' ? t('header.serverOnline') : 
                 serverStatus === 'offline' ? t('header.serverOffline') : t('header.checking')}
              </span>
            </div>

            {/* History Count */}
            {historyCount > 0 && (
              <div className="bg-primary-100 text-primary-800 text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full">
                <span className="hidden xs:inline">{historyCount} {t('header.analyses')}</span>
                <span className="xs:hidden">{historyCount}</span>
              </div>
            )}

            {/* Language Toggle */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
              className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={language === 'en' ? t('header.switchToArabic') : t('header.switchToEnglish')}
              title={language === 'en' ? t('header.switchToArabic') : t('header.switchToEnglish')}
            >
              <GlobeAltIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="hidden sm:inline">
                {language === 'ar' ? t('header.switchToArabic') : t('header.switchToEnglish')}
              </span>
              <span className="sm:hidden">
                {language === 'ar' ? 'ع' : 'EN'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;