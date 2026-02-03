"use client";

import api from "./api";
import {
  BaseSpecParams,
  PaginatedResponse,
  RegisterUser,
  ChangeUserPassword,
  User,
  ResetPassword,
  ForgotPassword,
} from "../types";
import { withCache, clearCache } from "@/utils/cache";

class AccountService {
  /** =====================
   * GET USERS (cached)
   * ===================== */
  getUsers = async (
    params: BaseSpecParams,
    forceRefresh = false,
  ): Promise<PaginatedResponse<User>> => {
    const query = new URLSearchParams();

    if (params?.pageIndex)
      query.append("PageIndex", params.pageIndex.toString());
    if (params?.pageSize) query.append("PageSize", params.pageSize.toString());
    if (params?.search) query.append("Search", params.search);
    if (params?.status) query.append("Status", params.status);
    if (params?.clientId) query.append("ClientId", params.clientId);
    if (params?.id) query.append("Id", params.id);
    if (params?.sort) query.append("Sort", params.sort);

    const cacheKey = `account:users:${query.toString()}`;

    return withCache(
      cacheKey,
      async () => {
        const response = await api.get<PaginatedResponse<User>>(
          `/account/users?${query.toString()}`,
        );
        return response.data;
      },
      forceRefresh,
    );
  };

  /** =====================
   * REGISTER USER (invalidate cache)
   * ===================== */
  async registerUser(data: RegisterUser): Promise<User> {
    const response = await api.post<User>("/account/register", data);
    await clearCache("account:users:");
    return response.data;
  }

  /** =====================
   * DELETE USER (invalidate cache)
   * ===================== */
  async deleteUser(username: string): Promise<boolean> {
    const response = await api.delete<boolean>(`/account/delete/${username}`);
    await clearCache("account:users:");
    return response.data;
  }

  /** =====================
   * UPDATE USER (invalidate cache)
   * ===================== */
  async updateUser(data: Partial<User>): Promise<User> {
    const response = await api.put<User>("/account/update", data);
    await clearCache("account:users:");
    return response.data;
  }

  /** =====================
   * PASSWORD OPERATIONS (no caching needed)
   * ===================== */
  async changePassword(data: ChangeUserPassword): Promise<boolean> {
    const response = await api.post<boolean>("/account/change-password", data);
    return response.data;
  }

  async resetPassword(data: ResetPassword): Promise<boolean> {
    const response = await api.post<boolean>("/account/reset-password", data);
    return response.data;
  }

  async forgotPassword(data: ForgotPassword): Promise<boolean> {
    const response = await api.post<boolean>("/account/forgot-password", data);
    return response.data;
  }
}

const accountService = new AccountService();
export default accountService;
