"use client";

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { authEvents } from "./authEvents";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.beautifulnepal.com";

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
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
      (response) => response,
      async (error: AxiosError & { config?: any }) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !this.isLoggingOut &&
          !originalRequest?._retry
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
            // 🔄 Refresh uses cookies
            //await authService.refreshToken();

            // Retry original request (cookies updated by backend)
            this.failedQueue.forEach((req) => req.resolve());
            this.failedQueue = [];

            return this.api(originalRequest);
          } catch (refreshError) {
            // ❌ Refresh failed → logout everywhere
            authEvents.emit("unauthorized");

            this.failedQueue.forEach((req) => req.reject(refreshError));
            this.failedQueue = [];

            return Promise.reject(error);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
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

  delete<T>(url: string) {
    return this.api.delete<T>(url);
  }
}

const apiService = new ApiService();
export default apiService;
