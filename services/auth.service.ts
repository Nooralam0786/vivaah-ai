/**
 * Authentication Service
 */

import { OTPVerification } from '@/types';
import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { saveAuthToStorage, getTokenExpirationTime } from '@/lib/auth';

export class AuthService {
  /**
   * Send OTP to phone number
   */
  static async sendOTP(phone: string) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { phone });
    return response as { otp_sent: boolean; expires_in: number };
  }

  /**
   * Verify OTP and create/get user
   */
  static async verifyOTP(payload: OTPVerification) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, payload);
    const data = response as {
      token: string;
      refreshToken: string;
      userId: string;
      expiresIn: number;
    };

    // Save to local storage
    saveAuthToStorage({
      accessToken: data.token,
      refreshToken: data.refreshToken,
      userId: data.userId,
      expiresAt: getTokenExpirationTime(data.expiresIn / 3600),
    });

    return data;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
    return response as { token: string; expiresIn: number };
  }

  /**
   * Logout user
   */
  static async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('vivaah_auth');
  }
}

export default AuthService;
