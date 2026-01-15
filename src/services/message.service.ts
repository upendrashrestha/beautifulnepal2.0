// services/message.service.ts
import api from "./api";
import { BaseSpecParams, Message, PaginatedResponse } from "@/types";

const messageService = {
  getMessages: async (
    params: BaseSpecParams
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

    const res = await api.get<PaginatedResponse<Message>>(
      `/messages?${query.toString()}`
    );
    return res.data;
  },

  getMessageById: async (id: string): Promise<Message> => {
    const res = await api.get<Message>(`/messages/${id}`);
    return res.data;
  },

  createMessage: async (data: Partial<Message>) => {
    await api.post("/messages", data);
  },

  deleteMessage: async (id: string) => {
    await api.delete(`/messages/${id}`);
  },
};

export default messageService;
