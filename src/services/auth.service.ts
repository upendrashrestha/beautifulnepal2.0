"use client";

import api from "./api";
import { AuthResponse, Login, Register, User } from "../types";
import storage from "@/utils/storage"; // clear localStorage or AsyncStorage

class AuthService {
  async login(credentials: Login): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/account/login",
      credentials
    );
    storage.setToken(response.data.token);
    // ✅ Cookies are set by backend
    return response.data;
  }

  async register(data: Register): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/account/register", data);

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post("/account/logout");
    } finally {
      // Clear any client-side tokens even if server fails
      await storage.removeToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/account");
    return response.data;
  }

  async refreshToken(): Promise<void> {
    // ✅ Refresh token read from HttpOnly cookie
    await api.post("/auth/refresh");
  }
}

const authService = new AuthService();
export default authService;
