"use client";

import api from "./api";
import {
  BaseSpecParams,
  Lead,
  LeadCreate,
  LeadUpdate,
  PaginatedResponse,
} from "@/types";

class LeadService {
  async getLeads(params: BaseSpecParams): Promise<PaginatedResponse<Lead>> {
    const query = new URLSearchParams();

    if (params?.pageIndex)
      query.append("PageIndex", params.pageIndex.toString());

    if (params?.pageSize) query.append("PageSize", params.pageSize.toString());

    if (params?.search) query.append("Search", params.search);

    if (params?.status) query.append("Status", params.status);

    if (params?.clientId) query.append("ClientId", params.clientId);

    if (params?.id) query.append("Id", params.id);

    if (params?.publicId) query.append("PublicId", params.publicId);

    if (params?.sort) query.append("Sort", params.sort);

    const response = await api.get<PaginatedResponse<Lead>>(
      `/leads?${query.toString()}`
    );

    return response.data;
  }

  async getLeadById(id: string): Promise<Lead> {
    const response = await api.get<Lead>(`/leads/${id}`);
    return response.data;
  }

  async createLead(data: LeadCreate): Promise<Lead> {
    const response = await api.post<Lead>("/leads", data);
    return response.data;
  }

  async updateLead(data: LeadUpdate): Promise<Lead> {
    const response = await api.put<Lead>("/leads", data);
    return response.data;
  }

  async deleteLead(data: string): Promise<Lead> {
    const response = await api.delete<Lead>(`/leads/delete/${data}`);
    return response.data;
  }
}
const leadService = new LeadService();
export default leadService;
