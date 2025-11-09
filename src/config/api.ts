export const API_BASE_URL = 'http://5.135.79.195';

export const API_ENDPOINTS = {
  health: '/health',
  detect: '/detect',
  history: '/history',
  statistics: '/statistics',
  detection: (id: number) => `/detection/${id}`
};

export const constructImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, use it as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path, construct full URL with server base
  return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};