// services/ProfileService.js
const BASE_URL = 'http://192.168.100.7:8080';

class ProfileService {
  /**
   * Create a new user profile
   * @param {string} userId - The user ID
   * @param {object} userDetails - The user details object
   * @returns {Promise<object>} - The created profile
   */
  async createProfile(userId, userDetails) {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/create/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userDetails.email,
          firstname: userDetails.firstName,
          lastname: userDetails.lastName,
          language: userDetails.language || 'English'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create profile: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile by userId
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
   * Update user profile
   * @param {string} userId - The user ID
   * @param {object} userDetails - The updated user details
   * @returns {Promise<string>} - Success message
   */
  async updateProfile(userId, userDetails) {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userDetails.email,
          firstname: userDetails.firstName,
          lastname: userDetails.lastName,
          language: userDetails.language || 'English'
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Profile not found');
        }
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

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
}

export default new ProfileService();