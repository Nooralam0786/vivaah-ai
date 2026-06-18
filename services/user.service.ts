/**
 * User Service
 */

import { UserProfile, UserPreferences } from '@/types';
import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

export class UserService {
  /**
   * Get current user profile
   */
  static async getProfile() {
    return apiClient.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE);
  }

  /**
   * Get user profile by ID
   */
  static async getProfileById(userId: string) {
    return apiClient.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE_BY_ID(userId));
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<UserProfile>) {
    return apiClient.patch<{ message: string }>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(data: Partial<UserPreferences>) {
    return apiClient.patch<{ message: string }>(API_ENDPOINTS.USERS.UPDATE_PREFERENCES, data);
  }

  /**
   * Get user preferences
   */
  static async getPreferences() {
    return apiClient.get<UserPreferences>(API_ENDPOINTS.USERS.PREFERENCES);
  }

  /**
   * Upload profile photo
   */
  static async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    return apiClient.upload<{ photoUrl: string }>(`${API_ENDPOINTS.USERS.PROFILE}/photo`, formData);
  }

  /**
   * Delete user account
   */
  static async deleteAccount() {
    return apiClient.delete<{ message: string }>(API_ENDPOINTS.USERS.DELETE_PROFILE);
  }
}

export default UserService;
