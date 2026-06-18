/**
 * API Client for VivaahAI
 * Centralized HTTP client with interceptors, error handling, and token management
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { APIResponse } from '@/types';

class APIClient {
  private client: AxiosInstance;

  constructor(baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
          // Token expired, try refresh
          if (!originalRequest?.url?.includes('/auth/refresh')) {
            const newToken = await this.refreshToken();
            if (newToken && originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          }
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private setAccessToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await this.client.post<APIResponse<{ token: string }>>('/api/auth/refresh', {
        refreshToken,
      });

      if (response.data.success && response.data.data) {
        this.setAccessToken(response.data.data.token);
        return response.data.data.token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return null;
  }

  // Generic request methods
  async get<T>(url: string, config = {}) {
    try {
      const response = await this.client.get<APIResponse<T>>(url, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: unknown, config = {}) {
    try {
      const response = await this.client.post<APIResponse<T>>(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: unknown, config = {}) {
    try {
      const response = await this.client.patch<APIResponse<T>>(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config = {}) {
    try {
      const response = await this.client.delete<APIResponse<T>>(url, config);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async upload<T>(url: string, formData: FormData) {
    try {
      const response = await this.client.post<APIResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleResponse<T>(response: AxiosResponse<APIResponse<T>>) {
    const { data } = response;
    if (!data.success) {
      throw new Error(data.error?.message || 'API request failed');
    }
    return data.data;
  }

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error?.message || error.message;
      return new Error(message);
    }
    return error;
  }
}

export const apiClient = new APIClient();

export default apiClient;
