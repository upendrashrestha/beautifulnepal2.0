"use client";

import api from "./api";
import { BaseSpecParams,  PaginatedResponse } from "@/types";
import { Event } from "@/types/event.types";

class EventService {
  async getEvents(params: BaseSpecParams): Promise<PaginatedResponse<Event>> {
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

    const response = await api.get<PaginatedResponse<Event>>(
      `/events?${query.toString()}`,
    );

    return response.data;
  }

  async getEventById(id: string): Promise<Event> {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  }

  async createEvent(data: Partial<Event>): Promise<Event> {
    const response = await api.post<Event>("/events", data);
    return response.data;
  }

  async updateEvent(data: Partial<Event>): Promise<Event> {
    const response = await api.put<Event>("/events", data);
    return response.data;
  }

  async deleteEvent(id: string): Promise<Event> {
    const response = await api.delete<Event>(`/events/delete/${id}`);
    return response.data;
  }
}
const eventService = new EventService();
export default eventService;
