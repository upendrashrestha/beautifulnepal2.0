// services/message.service.ts
import api from "./api";
import { BaseSpecParams, Message, PaginatedResponse } from "@/types";
import { withCache, clearCache } from "@/utils/cache";

const messageService = {
  /** =====================
   * LIST (cached)
   * ===================== */
  getMessages: async (
    params: BaseSpecParams,
  ): Promise<PaginatedResponse<Message>> => {
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

    const cacheKey = `messages:list:${query.toString()}`;

    return withCache(cacheKey, async () => {
      const res = await api.get<PaginatedResponse<Message>>(
        `/messages?${query.toString()}`,
      );
      return res.data;
    });
  },

  /** =====================
   * DETAIL (cached)
   * ===================== */
  getMessageById: async (id: string): Promise<Message> => {
    const cacheKey = `messages:detail:${id}`;

    return withCache(cacheKey, async () => {
      const res = await api.get<Message>(`/messages/${id}`);
      return res.data;
    });
  },

  /** =====================
   * CREATE (invalidate)
   * ===================== */
  createMessage: async (data: Partial<Message>) => {
    await api.post("/messages", data);

    // Invalidate message lists
    await clearCache("messages:list:");
  },

  /** =====================
   * DELETE (invalidate)
   * ===================== */
  deleteMessage: async (id: string) => {
    await api.delete(`/messages/${id}`);

    await clearCache(`messages:detail:${id}`);
    await clearCache("messages:list:");
  },
};

export default messageService;
