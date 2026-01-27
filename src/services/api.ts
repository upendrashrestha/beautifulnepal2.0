"use client";

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { authEvents } from "./authEvents";
import storage from "@/utils/storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://beautifulnepalapi.fly.dev/api";

class ApiService {
  private api: AxiosInstance;
  private isLoggingOut = false;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10_000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /** =====================
   * Token helpers
   * ===================== */
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return storage.getToken();
  }

  private clearAccessToken() {
    if (typeof window === "undefined") return;
    storage.removeToken();
  }

  /** =====================
   * Interceptors
   * ===================== */
  private setupInterceptors() {
    /** Request interceptor */
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Let browser set Content-Type for FormData
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    /** Response interceptor */
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (!error.response) {
          console.error("Network error:", error.message);
          return Promise.reject(error);
        }

        if (error.response.status === 401 && !this.isLoggingOut) {
          this.isLoggingOut = true;
          this.clearAccessToken();
          authEvents.emit("unauthorized");
        }

        return Promise.reject(error);
      },
    );
  }

  /** =====================
   * Public helpers
   * ===================== */
  public setLoggingOut(flag: boolean) {
    this.isLoggingOut = flag;
    if (flag) this.clearAccessToken();
  }

  get<T>(url: string, params?: unknown) {
    return this.api.get<T>(url, { params });
  }

  post<T>(url: string, data?: unknown) {
    return this.api.post<T>(url, data);
  }

  // Add dedicated method for FormData
  postFormData<T>(url: string, data: FormData) {
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

  public cleanup() {
    this.isLoggingOut = false;
    this.clearAccessToken();
  }
}

const apiService = new ApiService();
export default apiService;
