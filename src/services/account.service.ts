"use client";

import api from "./api";
import {
  BaseSpecParams,
  PaginatedResponse,
  RegisterUser,
  ChangeUserPassword,
  User,
} from "../types";

class AccountService {
  getUsers = async (
    params: BaseSpecParams,
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

    const response = await api.get<PaginatedResponse<User>>(
      `/account/users?${query.toString()}`,
    );
    return response.data;
  };

  async registerUser(data: RegisterUser): Promise<User> {
    const response = await api.post<User>("/account/register", data);
    return response.data;
  }

  async deleteUser(username: string): Promise<boolean> {
    const response = await api.delete<boolean>(`/account/delete/${username}`);
    return response.data;
  }

  async updateUser(data: Partial<User>): Promise<User> {
    const response = await api.put<User>("/account/update", data);
    return response.data;
  }

  async changePassword(data: ChangeUserPassword): Promise<boolean> {
    const response = await api.post<boolean>("/account/change-password", data);
    return response.data;
  }
}

const accountService = new AccountService();
export default accountService;
