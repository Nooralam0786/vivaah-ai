/**
 * Match Service
 */

import { Match, MatchCard } from '@/types';
import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

export interface MatchResponse {
  matches: MatchCard[];
  total: number;
  dailyLimit: number;
  remaining: number;
}

export class MatchService {
  /**
   * Get recommended matches for current user
   */
  static async getMatches(page = 1, limit = 20) {
    return apiClient.get<MatchResponse>(API_ENDPOINTS.MATCHES.GET, {
      params: { page, limit },
    });
  }

  /**
   * Like a user
   */
  static async likeUser(likedUserId: string) {
    return apiClient.post<{ liked: boolean; isMutual: boolean }>(
      API_ENDPOINTS.MATCHES.LIKE,
      { likedUserId }
    );
  }

  /**
   * Pass on a user
   */
  static async passUser(passedUserId: string) {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.MATCHES.PASS,
      { passedUserId }
    );
  }

  /**
   * Get mutual matches (both users liked each other)
   */
  static async getMutualMatches() {
    return apiClient.get<Match[]>(API_ENDPOINTS.MATCHES.MUTUAL);
  }

  /**
   * Report a user
   */
  static async reportUser(userId: string, reason: string) {
    return apiClient.post<{ message: string }>(`${API_ENDPOINTS.MATCHES.GET}/report`, {
      userId,
      reason,
    });
  }
}

export default MatchService;
