// services/client.service.ts
import api from "./api";
import { withCache, clearCache } from "@/utils/cache";
import { BaseSpecParams, Client, PaginatedResponse } from "../../types";

/** Helper to build deterministic cache keys */
const buildClientsKey = (params: BaseSpecParams) => {
  const query = new URLSearchParams();

  if (params?.pageIndex) query.append("PageIndex", params.pageIndex.toString());
  if (params?.pageSize) query.append("PageSize", params.pageSize.toString());
  if (params?.search) query.append("Search", params.search);
  if (params?.status) query.append("Status", params.status);
  if (params?.clientId) query.append("ClientId", params.clientId);
  if (params?.id) query.append("Id", params.id);
  if (params?.publicId) query.append("PublicId", params.publicId);
  if (params?.sort) query.append("Sort", params.sort);

  return `clients:list:${query.toString() || "all"}`;
};

const clientService = {
  /** =====================
   * READ (cached)
   * ===================== */
  getClients: async (
    params: BaseSpecParams,
    forceRefresh = false,
  ): Promise<PaginatedResponse<Client>> => {
    const cacheKey = buildClientsKey(params);

    return withCache(
      cacheKey,
      async () => {
        const res = await api.get<PaginatedResponse<Client>>(
          `/clients?${new URLSearchParams(
            Object.entries(params ?? {})
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)]),
          ).toString()}`,
        );
        return res.data;
      },
      forceRefresh,
      60 * 5, // 5 minutes
    );
  },

  getClientById: async (id: string, forceRefresh = false): Promise<Client> => {
    return withCache(
      `clients:detail:${id}`,
      async () => {
        const res = await api.get<Client>(`/clients/${id}`);
        return res.data;
      },
      forceRefresh,
      60 * 10, // 10 minutes
    );
  },

  /** =====================
   * WRITE (invalidate cache)
   * ===================== */
  createClient: async (data: Partial<Client>) => {
    await api.post("/clients", data);

    // Invalidate related caches
    await clearCache("clients:list");
  },

  updateClient: async (id: string, data: Partial<Client>) => {
    await api.put(`/clients`, data);

    // Invalidate related caches
    await clearCache(`clients:detail:${id}`);
    await clearCache("clients:list");
  },
};

export default clientService;
