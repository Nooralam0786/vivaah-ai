/**
 * Payment Service
 */

import { Subscription } from '@/types';
import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

export interface PaymentResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  tier: string;
}

export class PaymentService {
  /**
   * Create subscription order
   */
  static async createSubscription(tier: 'gold' | 'platinum' | 'diamond') {
    return apiClient.post<PaymentResponse>(API_ENDPOINTS.PAYMENTS.SUBSCRIBE, { tier });
  }

  /**
   * Get billing history
   */
  static async getBillingHistory() {
    return apiClient.get<Subscription[]>(API_ENDPOINTS.PAYMENTS.BILLING_HISTORY);
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription() {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.PAYMENTS.CANCEL_SUBSCRIPTION, {});
  }

  /**
   * Verify payment webhook (called from backend)
   */
  static async verifyWebhook(payload: unknown) {
    return apiClient.post<{ verified: boolean }>(API_ENDPOINTS.PAYMENTS.WEBHOOK, payload);
  }
}

export default PaymentService;
