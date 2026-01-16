"use client";

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { authEvents } from "./authEvents";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://beautifulnepalapi.fly.dev/api";

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiService {
  private api: AxiosInstance;
  private isLoggingOut = false;
  private isRefreshing = false;
  private failedQueue: FailedRequest[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10_000,
      withCredentials: true, // ✅ CRITICAL for cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    /** =====================
     * Request interceptor
     * ===================== */
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // ⛔ NO TOKEN HANDLING HERE
        // Cookies are sent automatically
        return config;
      },
      (error) => Promise.reject(error)
    );

    /** =====================
     * Response interceptor
     * ===================== */
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        // Handle network errors
        if (!error.response) {
          console.error("Network error:", error.message);
          return Promise.reject(error);
        }

        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Ensure originalRequest exists
        if (!originalRequest) {
          return Promise.reject(error);
        }

        if (
          error.response.status === 401 &&
          !this.isLoggingOut &&
          !originalRequest._retry
        ) {
          // If refresh already in progress, queue request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.api(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // 🔄 Refresh token endpoint
            await this.api.post("/auth/refresh");

            // Process queued requests
            this.processQueue(null);

            // Retry original request (cookies updated by backend)
            return this.api(originalRequest);
          } catch (refreshError) {
            // ❌ Refresh failed → logout everywhere
            this.processQueue(refreshError);
            authEvents.emit("unauthorized");

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /** =====================
   * Queue processing helper
   * ===================== */
  private processQueue(error: unknown) {
    this.failedQueue.forEach((req) => {
      if (error) {
        req.reject(error);
      } else {
        req.resolve();
      }
    });

    this.failedQueue = [];
  }

  /** =====================
   * Public helpers
   * ===================== */

  public setLoggingOut(flag: boolean) {
    this.isLoggingOut = flag;
  }

  get<T>(url: string, params?: unknown) {
    return this.api.get<T>(url, { params });
  }

  post<T>(url: string, data?: unknown) {
    return this.api.post<T>(url, data);
  }

  put<T>(url: string, data?: unknown) {
    return this.api.put<T>(url, data);
  }

  patch<T>(url: string, data?: unknown) {
    return this.api.patch<T>(url, data);
  }

  delete<T>(url: string) {
    return this.api.delete<T>(url);
  }

  // Cleanup method for when service needs to be reset
  public cleanup() {
    this.failedQueue = [];
    this.isRefreshing = false;
    this.isLoggingOut = false;
  }
}

const apiService = new ApiService();
export default apiService;