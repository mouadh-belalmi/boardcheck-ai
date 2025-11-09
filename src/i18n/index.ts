// Centralized internationalization system for BoardCheck AI

export type Language = 'en' | 'ar';

export interface TranslationKey {
  en: string;
  ar: string;
}

export const translations = {
  // Header
  header: {
    serverOnline: { en: 'Server Online', ar: 'الخادم متصل' },
    serverOffline: { en: 'Server Offline', ar: 'الخادم غير متصل' },
    checking: { en: 'Checking...', ar: 'جاري الفحص...' },
    analyses: { en: 'analyses', ar: 'تحليلات' },
    switchToArabic: { en: 'العربية', ar: 'English' },
    switchToEnglish: { en: 'العربية', ar: 'English' }
  },

  // Hero Section
  hero: {
    title: { en: 'PCB Defect Detection', ar: 'كشف عيوب اللوحات المطبوعة' },
    subtitle: { en: 'AI-powered quality control for your PCBs', ar: 'مراقبة جودة مدعومة بالذكاء الاصطناعي للوحاتك المطبوعة' }
  },

  // Upload Interface
  upload: {
    title: { en: 'Upload PCB Image', ar: 'رفع صورة اللوحة المطبوعة' },
    dropzone: { en: 'Drag and drop an image here, or click to select', ar: 'اسحب وأفلت صورة هنا، أو انقر للاختيار' },
    formats: { en: 'Supports JPG, PNG, BMP up to 10MB', ar: 'يدعم JPG، PNG، BMP حتى 10MB' },
    uploadFromDevice: { en: 'Upload from Device', ar: 'رفع من الجهاز' },
    demo: { en: 'Use Demo Image', ar: 'استخدام صورة تجريبية' },
    analyzing: { en: 'Analyzing...', ar: 'جاري التحليل...' },
    error: { en: 'Error:', ar: 'خطأ:' },
    fileTooLarge: { en: 'File too large. Maximum 10MB allowed', ar: 'الملف كبير جداً. الحد الأقصى 10MB' },
    fileTypeNotSupported: { en: 'File type not supported. Use JPG, PNG, or BMP', ar: 'نوع الملف غير مدعوم. استخدم JPG، PNG، أو BMP' },
    demoImageNotAvailable: { en: 'Demo image not available', ar: 'لم يتم العثور على الصورة التجريبية' }
  },

  // Results Display
  results: {
    title: { en: 'Analysis Results', ar: 'نتائج التحليل' },
    noDefects: { en: 'No Defects Found', ar: 'لم يتم العثور على عيوب' },
    defectsFound: { en: 'Defects Detected', ar: 'تم العثور على عيوب' },
    defectTypes: { en: 'Defect Types', ar: 'أنواع العيوب' },
    confidence: { en: 'Confidence', ar: 'الثقة' },
    saveToHistory: { en: 'Save to History', ar: 'حفظ في السجل' },
    original: { en: 'Original', ar: 'الأصلية' },
    analyzed: { en: 'Analyzed', ar: 'المحللة' },
    zoomIn: { en: 'Zoom In', ar: 'تكبير' },
    zoomOut: { en: 'Zoom Out', ar: 'تصغير' },
    qualityGrade: { en: 'Quality Grade', ar: 'تصنيف الجودة' },
    defectsDetected: { en: 'defects detected', ar: 'عيوب تم اكتشافها' },
    instance: { en: 'instance', ar: 'حالة' },
    instances: { en: 'instances', ar: 'حالات' },
    imageLoadFailed: { en: 'Failed to load analyzed image', ar: 'فشل في تحميل الصورة المحللة' },
    viewOriginalInstead: { en: 'View original instead', ar: 'عرض الصورة الأصلية بدلاً من ذلك' }
  },

  // History Section
  history: {
    title: { en: 'Analysis History', ar: 'سجل التحليل' },
    empty: { en: 'No saved analyses', ar: 'لا يوجد تحليلات محفوظة' },
    clearAll: { en: 'Clear All', ar: 'مسح الكل' },
    view: { en: 'View', ar: 'عرض' },
    delete: { en: 'Delete', ar: 'حذف' },
    defectsFound: { en: 'Defects Found', ar: 'عيوب موجودة' },
    noDefects: { en: 'No Defects', ar: 'لا توجد عيوب' },
    defects: { en: 'defects', ar: 'عيوب' },
    noResultsForFilter: { en: 'No results for this filter', ar: 'لا توجد نتائج لهذا المرشح' },
    filters: {
      all: { en: 'All', ar: 'الكل' },
      defects: { en: 'With Defects', ar: 'مع عيوب' },
      clean: { en: 'Clean', ar: 'نظيفة' }
    }
  },

  // Common Actions
  actions: {
    retry: { en: 'Retry', ar: 'إعادة المحاولة' },
    newAnalysis: { en: 'New Analysis', ar: 'تحليل جديد' },
    viewHistory: { en: 'View History', ar: 'عرض السجل' },
    back: { en: 'Back', ar: 'رجوع' },
    cancel: { en: 'Cancel', ar: 'إلغاء' },
    confirm: { en: 'Confirm', ar: 'تأكيد' },
    save: { en: 'Save', ar: 'حفظ' },
    close: { en: 'Close', ar: 'إغلاق' }
  },

  // Error Messages
  errors: {
    analysisError: { en: 'An error occurred during analysis', ar: 'حدث خطأ أثناء التحليل' },
    networkError: { en: 'Network error. Check your connection', ar: 'خطأ في الشبكة. تحقق من اتصالك' },
    serverError: { en: 'Server error. Please try again', ar: 'خطأ في الخادم. حاول مرة أخرى' },
    invalidFile: { en: 'Invalid file', ar: 'ملف غير صالح' },
    networkConnectionFailed: { en: 'Network connection failed. Please check your internet connection.', ar: 'فشل الاتصال بالشبكة. تحقق من اتصال الإنترنت.' },
    requestTimedOut: { en: 'Request timed out. The server may be starting up, please try again.', ar: 'انتهت مهلة الطلب. قد يكون الخادم قيد التشغيل، حاول مرة أخرى.' },
    serverErrorRetry: { en: 'Server error. Please try again later.', ar: 'خطأ في الخادم. حاول مرة أخرى لاحقاً.' },
    fileTooLarge: { en: 'Image file is too large. Please use an image under 10MB.', ar: 'الملف كبير جداً. استخدم صورة أقل من 10MB.' },
    invalidImageFormat: { en: 'Invalid image format. Please use JPG, PNG, or BMP.', ar: 'تنسيق الصورة غير صالح. استخدم JPG أو PNG أو BMP.' },
    imageNotFound: { en: 'Image not found.', ar: 'الصورة غير موجودة.' },
    unexpectedError: { en: 'An unexpected error occurred. Please try again.', ar: 'حدث خطأ غير متوقع. حاول مرة أخرى.' }
  },

  // Success Messages
  success: {
    analysisSaved: { en: 'Analysis saved', ar: 'تم حفظ التحليل' }
  },

  // Confirmation Messages
  confirmations: {
    clearHistory: { en: 'Are you sure you want to clear all history?', ar: 'هل تريد مسح جميع السجلات؟' }
  },

  // Defect Types
  defectTypes: {
    missing_hole: { en: 'Missing Hole', ar: 'ثقب مفقود' },
    mouse_bite: { en: 'Mouse Bite', ar: 'عضة الفأر' },
    open_circuit: { en: 'Open Circuit', ar: 'دائرة مفتوحة' },
    short_circuit: { en: 'Short Circuit', ar: 'دائرة قصيرة' },
    spur: { en: 'Spur', ar: 'نتوء' },
    spurious_copper: { en: 'Spurious Copper', ar: 'نحاس زائد' }
  },

  // Footer
  footer: {
    copyright: { en: '© 2024 BoardCheck AI - AI-powered PCB defect detection', ar: '© 2024 BoardCheck AI - مدعوم بالذكاء الاصطناعي لفحص اللوحات المطبوعة' }
  }
} as const;

// Helper function to get translation for a specific language
export const t = (key: string, language: Language): string => {
  const keys = key.split('.');
  let value: unknown = translations;
  
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key itself if translation not found
    }
  }
  
  if (typeof value === 'object' && value !== null && language in value) {
    const translationValue = (value as Record<string, string>)[language];
    if (typeof translationValue === 'string') {
      return translationValue;
    }
  }
  
  console.warn(`Translation not found for key: ${key}, language: ${language}`);
  return key;
};

// Hook for using translations in components
export const useTranslation = (language: Language) => {
  return (key: string) => t(key, language);
};