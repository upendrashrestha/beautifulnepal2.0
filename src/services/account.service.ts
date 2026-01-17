"use client";

import api from "./api";
import { RegisterUser, ResetUserPassword, User } from "../types";

class AccountService {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/account/users");
    return response.data;
  }

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

  async resetPassword(data: ResetUserPassword): Promise<boolean> {
    const response = await api.post<boolean>("/account/reset-password", data);
    return response.data;
  }
}

const accountService = new AccountService();
export default accountService;
