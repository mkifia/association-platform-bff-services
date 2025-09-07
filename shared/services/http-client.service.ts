import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiResponse, ErrorResponse } from '../types/api-responses';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);
  private client: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response received: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        this.logger.error('Response error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(this.handleError(error));
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Health check utility
  async healthCheck(endpoint: string = '/health'): Promise<boolean> {
    try {
      const response = await this.client.get(endpoint, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      this.logger.warn(`Health check failed for endpoint ${endpoint}:`, error.message);
      return false;
    }
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Add custom header
  setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  // Remove custom header
  removeHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }

  private handleError(error: any): ErrorResponse {
    const timestamp = new Date().toISOString();
    
    if (error.response) {
      // Server responded with error status
      const { status, statusText, data } = error.response;
      return {
        success: false,
        error: data?.error || data?.message || statusText || 'Request failed',
        message: data?.message,
        statusCode: status,
        timestamp,
        path: error.config?.url,
      };
    } else if (error.request) {
      // Network error or no response
      return {
        success: false,
        error: 'Network error',
        message: 'Unable to connect to the server',
        statusCode: 0,
        timestamp,
        path: error.config?.url,
      };
    } else {
      // Other error
      return {
        success: false,
        error: 'Request error',
        message: error.message || 'An unexpected error occurred',
        statusCode: 500,
        timestamp,
      };
    }
  }

  // Utility method to build query parameters
  buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // Retry mechanism
  async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries) {
          this.logger.warn(`Retry attempt ${i + 1}/${maxRetries} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }
    
    throw lastError;
  }
}
