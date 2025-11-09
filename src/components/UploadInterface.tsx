import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  PhotoIcon,
  BeakerIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { useTranslation, type Language } from '../i18n';

interface UploadInterfaceProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  language: Language;
}

const UploadInterface: React.FC<UploadInterfaceProps> = ({ 
  onFileSelect, 
  isAnalyzing, 
  language 
}) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslation(language);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(t('upload.fileTooLarge'));
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError(t('upload.fileTypeNotSupported'));
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/bmp': ['.bmp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isAnalyzing
  });

  const handleDemoImage = async () => {
    const demoImages = [
      { path: '/missing_hole.jpg', name: 'missing_hole.jpg' },
      { path: '/open_circuit.jpg', name: 'open_circuit.jpg' }
    ];

    try {
      // Just use the first demo image for now to match single file selection pattern
      const demo = demoImages[0];
      const response = await fetch(demo.path);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${demo.name}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], demo.name, { type: 'image/jpeg' });
      
      // Process this demo image
      onFileSelect(file);
    } catch (error) {
      setError(t('upload.demoImageNotAvailable'));
      console.error('Demo image error:', error);
    }
  };

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8"
        >
          {t('upload.title')}
        </motion.h3>

        {/* Main Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-card p-6 sm:p-8 lg:p-12 text-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${isDragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }
              ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            role="button"
            tabIndex={0}
            aria-label={t('upload.dropzone')}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            
            {isAnalyzing ? (
              <div className="space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                >
                  <CloudArrowUpIcon className="w-full h-full text-primary-500" />
                </motion.div>
                <p className="text-base sm:text-lg font-medium text-primary-600">{t('upload.analyzing')}</p>
                <div className="w-32 sm:w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <CloudArrowUpIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" aria-hidden="true" />
                <p className="text-base sm:text-lg font-medium text-gray-700 px-2">
                  {t('upload.dropzone')}
                </p>
                <p className="text-sm text-gray-500 px-2">
                  {t('upload.formats')}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
          >
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">
              <span className="font-medium">{t('upload.error')}</span> {error}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 bg-white border border-gray-300 rounded-card text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={t('upload.uploadFromDevice')}
          >
            <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">{t('upload.uploadFromDevice')}</span>
          </button>

          <button
            onClick={handleDemoImage}
            disabled={isAnalyzing}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 bg-primary-50 border border-primary-200 rounded-card text-primary-700 hover:bg-primary-100 hover:border-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={t('upload.demo')}
          >
            <BeakerIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">{t('upload.demo')}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadInterface;