import { DefectResponse } from '../types';
import { API_BASE_URL } from '../config/api';

export class ApiService {
  static maxRetries = 3;
  static retryDelay = 2000; // 2 seconds

  static parseErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return 'Request timed out. The server may be starting up, please try again.';
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return 'Network connection failed. Please check your internet connection.';
      } else if (error.message.includes('Failed to detect defects')) {
        return error.message.replace('Error: ', '');
      } else {
        return 'An unexpected error occurred. Please try again.';
      }
    }
    return 'An unexpected error occurred. Please try again.';
  }

  static async checkHealth(retryCount = 0): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });
      return response.ok;
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.checkHealth(retryCount + 1);
      }
      console.error(`Health check failed after ${this.maxRetries} retries:`, error);
      return false;
    }
  }

  static async detectDefects(imageFile: File, onProgress?: (progress: number) => void): Promise<DefectResponse> {
    // Validate file size
    if (imageFile.size === 0) {
      throw new Error('Image file is empty');
    }

    if (imageFile.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Image file is too large. Please use an image under 10MB.');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error('Invalid image format. Please use JPG, PNG, or BMP.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`${API_BASE_URL}/detect`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        signal: AbortSignal.timeout(120000) // 2 minutes for processing
      });

      // Handle different status codes like the Flutter version
      switch (response.status) {
        case 200:
          try {
            const responseData = await response.json();
            if (typeof responseData !== 'object' || responseData === null) {
              throw new Error('Invalid response format');
            }
            
            // Log the response for debugging
            console.log('API Response:', responseData);
            if (responseData.result_image_url) {
              console.log('Result image URL:', responseData.result_image_url);
            }
            
            return responseData;
          } catch (parseError) {
            throw new Error('Server returned invalid data format');
          }

        case 400:
          const errorText400 = await response.text();
          const error400 = this.tryParseErrorMessage(errorText400);
          throw new Error(error400 || 'Invalid image format. Please use JPG, PNG, or BMP.');

        case 413:
          throw new Error('Image file is too large for server. Please reduce size.');

        case 500:
        case 502:
        case 503:
          throw new Error('Server error. Please try again later.');

        case 504:
          throw new Error('Server gateway timeout. Please try again.');

        default:
          const errorText = await response.text();
          const error = this.tryParseErrorMessage(errorText);
          throw new Error(error || `Unexpected error (${response.status})`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('The analysis is taking too long. The server might be under heavy load.');
        }
        if (error.name === 'TypeError') {
          throw new Error('Failed to connect to server. Please check if server is running.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred during analysis.');
    }
  }

  static tryParseErrorMessage(body: string): string | null {
    try {
      const data = JSON.parse(body);
      if (data && typeof data === 'object') {
        if (data.error) return data.error.toString();
        if (data.message) return data.message.toString();
      }
    } catch (_) {}
    return null;
  }

  static async getDetectionHistory(page = 1, perPage = 20): Promise<any> {
    try {
      const url = new URL(`${API_BASE_URL}/history`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('per_page', perPage.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(30000)
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to load history (Status: ${response.status})`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out while loading history.');
        }
        throw error;
      }
      throw new Error('Failed to load detection history.');
    }
  }

  static async getStatistics(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(30000)
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to load statistics (Status: ${response.status})`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out while loading statistics.');
        }
        throw error;
      }
      throw new Error('Failed to load statistics.');
    }
  }

  static async getDetectionDetails(detectionId: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/detection/${detectionId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(30000)
      });

      if (response.status === 200) {
        return await response.json();
      } else if (response.status === 404) {
        throw new Error('Detection not found.');
      } else {
        throw new Error(`Failed to load detection details (Status: ${response.status})`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out while loading detection details.');
        }
        throw error;
      }
      throw new Error('Failed to load detection details.');
    }
  }

  static validateImage(imageFile: File): boolean {
    try {
      if (imageFile.size === 0 || imageFile.size > 10 * 1024 * 1024) return false;

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
      return validTypes.includes(imageFile.type);
    } catch (_) {
      return false;
    }
  }
}