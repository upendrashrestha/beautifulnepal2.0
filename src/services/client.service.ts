// services/client.service.ts
import api from "./api";
import { BaseSpecParams, Client, PaginatedResponse } from "@/types";

const clientService = {
  getClients: async (
    params: BaseSpecParams
  ): Promise<PaginatedResponse<Client>> => {
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

    const res = await api.get<PaginatedResponse<Client>>(
      `/clients?${query.toString()}`
    );
    return res.data;
  },

  getClientById: async (id: string): Promise<Client> => {
    const res = await api.get<Client>(`/clients/${id}`);
    return res.data;
  },

  createClient: async (data: Partial<Client>) => {
    await api.post("/clients", data);
  },

  updateClient: async (id: string, data: Partial<Client>) => {
    await api.put(`/clients`, data);
  },
};

export default clientService;
