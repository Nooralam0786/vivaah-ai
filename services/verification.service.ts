/**
 * Verification Service
 */

import { VerificationRecord, IDUploadPayload } from '@/types';
import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

export class VerificationService {
  /**
   * Get verification status for current user
   */
  static async getStatus() {
    return apiClient.get<VerificationRecord>(API_ENDPOINTS.VERIFICATION.STATUS);
  }

  /**
   * Verify phone number (send OTP)
   */
  static async verifyPhone(phone: string) {
    return apiClient.post<{ otp_sent: boolean }>(API_ENDPOINTS.VERIFICATION.PHONE, { phone });
  }

  /**
   * Verify email (send link)
   */
  static async verifyEmail(email: string) {
    return apiClient.post<{ link_sent: boolean }>(API_ENDPOINTS.VERIFICATION.EMAIL, { email });
  }

  /**
   * Upload government ID for verification
   */
  static async uploadID(payload: IDUploadPayload) {
    const formData = new FormData();
    formData.append('idType', payload.idType);
    formData.append('idNumber', payload.idNumber);
    formData.append('photo', payload.photo);

    return apiClient.upload<{ message: string; fraudScore: number }>(
      API_ENDPOINTS.VERIFICATION.ID_UPLOAD,
      formData
    );
  }

  /**
   * Record liveness detection video
   */
  static async recordLiveness(video: Blob) {
    const formData = new FormData();
    formData.append('video', video);

    return apiClient.upload<{ success: boolean; faceMatchScore: number }>(
      API_ENDPOINTS.VERIFICATION.LIVENESS,
      formData
    );
  }
}

export default VerificationService;
