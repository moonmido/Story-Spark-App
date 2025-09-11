// services/SettingsService.js
const BASE_URL = 'http://192.168.100.7:8080';

class SettingsService {
  /**
   * Change user's preferred language
   * @param {string} userId - The user ID
   * @param {string} language - The new language
   * @returns {Promise<string>} - Success message
   */
  async changeLanguage(userId, language) {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/${userId}/language?languageRequest=${encodeURIComponent(language)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Profile not found');
        }
        const errorText = await response.text();
        throw new Error(`Failed to update language: ${errorText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  }

  /**
   * Get user profile to retrieve current language
   * @param {string} userId - The user ID
   * @returns {Promise<object>} - The user profile
   */
  async getProfile(userId) {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Profile not found');
        }
        const errorText = await response.text();
        throw new Error(`Failed to get profile: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  /**
   * Deactivate user account
   * @param {string} userId - The user ID
   * @returns {Promise<object>} - Response object
   */
  async deactivateAccount(userId) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/deactivate/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to deactivate account');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw error;
    }
  }

  /**
   * Health check for auth service
   * @returns {Promise<object>} - Health status
   */
  async healthCheck() {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Health check failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in health check:', error);
      throw error;
    }
  }

  /**
   * Map language codes to full language names for backend
   * @param {string} languageCode - The language code (e.g., 'en', 'es')
   * @returns {string} - The full language name
   */
  mapLanguageCodeToName(languageCode) {
    const languageMap = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
    };
    
    return languageMap[languageCode] || 'English';
  }

  /**
   * Map backend language names to language codes
   * @param {string} languageName - The full language name
   * @returns {string} - The language code
   */
  mapLanguageNameToCode(languageName) {
    const codeMap = {
      'English': 'en',
      'Spanish': 'es',
      'French': 'fr',
      'German': 'de',
      'Italian': 'it',
      'Portuguese': 'pt',
      'Russian': 'ru',
      'Japanese': 'ja',
      'Korean': 'ko',
      'Chinese': 'zh',
      'Arabic': 'ar',
      'Hindi': 'hi',
    };
    
    return codeMap[languageName] || 'en';
  }
}

export default new SettingsService();