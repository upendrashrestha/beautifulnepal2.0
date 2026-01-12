import api from "./api";
import { Lead, LeadCreate, PaginatedResponse } from "@/types";

class LeadService {
  async getLeads(params?: any): Promise<Lead[]> {
    const response = await api.get<PaginatedResponse<Lead>>("/leads", {
      params,
    });

    // 🔥 IMPORTANT
    return response.data.data;
  }

  async getLeadById(id: string): Promise<Lead> {
    const response = await api.get<Lead>(`/leads/${id}`);
    return response.data;
  }

  async createLead(data: LeadCreate): Promise<Lead> {
    const response = await api.post<Lead>("/leads", data);
    return response.data;
  }

  async updateLead(id: string, data: Lead): Promise<Lead> {
    const response = await api.put<Lead>("/leads", data);
    return response.data;
  }
}
const leadService = new LeadService();
export default leadService;
