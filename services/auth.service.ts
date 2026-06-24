/**
 * Authentication Service
 */

import { OTPVerification } from '@/types';
import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { saveAuthToStorage, getTokenExpirationTime } from '@/lib/auth';
import type { SignupFormData, LoginFormData } from '@/lib/validation';

interface AuthTokens {
  token: string;
  refreshToken: string;
  userId: string;
  expiresIn: number;
}

export class AuthService {
  /**
   * Create a new account with full name, email, phone and password.
   * Returns raw tokens — caller (AuthContext.login) is responsible for persisting them.
   */
  static async signup(payload: SignupFormData) {
    return (await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, payload)) as AuthTokens;
  }

  /**
   * Log in with an email or phone number + password.
   * Returns raw tokens — caller (AuthContext.login) is responsible for persisting them.
   */
  static async login(payload: LoginFormData) {
    return (await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)) as AuthTokens;
  }

  /**
   * Send OTP to phone number (used for phone verification, not login)
   */
  static async sendOTP(phone: string) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, { phone });
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
