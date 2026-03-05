import api from "./api";
import { withCache, clearCache } from "@/utils/cache";
import { PaginatedResponse } from "../../types";
import { Event, EventSpecParams } from "../../types/event.types";

/** Build deterministic cache key for event lists */
const buildEventsKey = (params: EventSpecParams) => {
  const query = new URLSearchParams();

  if (params?.pageIndex) query.append("PageIndex", params.pageIndex.toString());
  if (params?.pageSize) query.append("PageSize", params.pageSize.toString());
  if (params?.search) query.append("Search", params.search);
  if (params?.status) query.append("Status", params.status);
  if (params?.type) query.append("Type", params.type);
  if (params?.city) query.append("City", params.city);
  if (params?.id) query.append("Id", params.id);
  if (params?.publicId) query.append("PublicId", params.publicId);
  if (params?.sort) query.append("Sort", params.sort);

  return `events:list:${query.toString() || "all"}`;
};

class EventService {
  /** =====================
   * READ (cached)
   * ===================== */

  async getEvents(
    params: EventSpecParams,
    forceRefresh = true,
  ): Promise<PaginatedResponse<Event>> {
    const cacheKey = buildEventsKey(params);

    return withCache(
      cacheKey,
      async () => {
        const query = new URLSearchParams();

        if (params?.pageIndex)
          query.append("PageIndex", params.pageIndex.toString());
        if (params?.pageSize)
          query.append("PageSize", params.pageSize.toString());
        if (params?.search) query.append("Search", params.search);
        if (params?.status) query.append("Status", params.status);
        if (params?.type) query.append("Type", params.type);
        if (params?.city) query.append("City", params.city);
        if (params?.id) query.append("Id", params.id);
        if (params?.publicId) query.append("PublicId", params.publicId);
        if (params?.sort) query.append("Sort", params.sort);
        if (params?.timeFilter) query.append("TimeFilter", params.timeFilter);

        const response = await api.get<PaginatedResponse<Event>>(
          `/events?${query.toString()}`,
        );
        return response.data;
      },
      forceRefresh,
      60 * 5, // 5 minutes
    );
  }

  async getEventById(id: string, forceRefresh = false): Promise<Event> {
    return withCache(
      `events:detail:${id}`,
      async () => {
        const response = await api.get<Event>(`/events/${id}`);
        return response.data;
      },
      forceRefresh,
      60 * 10, // 10 minutes
    );
  }

  async getEventBySlug(slug: string, forceRefresh = false): Promise<Event> {
    return withCache(
      `events:public:${slug}`,
      async () => {
        const response = await api.get<Event>(`/events/public/${slug}`);
        return response.data;
      },
      forceRefresh,
      60 * 10, // 10 minutes
    );
  }

  /** =====================
   * WRITE (invalidate cache)
   * ===================== */

  async createEvent(data: Partial<Event>): Promise<Event> {
    const response = await api.post<Event>("/events", data);

    await clearCache("events:list");

    return response.data;
  }

  async updateEvent(data: Partial<Event>): Promise<Event> {
    const response = await api.put<Event>("/events", data);

    if (data.id) {
      await clearCache(`events:detail:${data.id}`);
    }

    if (data.slug) {
      await clearCache(`events:public:${data.slug}`);
    }

    await clearCache("events:list");

    return response.data;
  }

  async deleteEvent(id: string): Promise<Event> {
    const response = await api.delete<Event>(`/events/delete/${id}`);

    await clearCache(`events:detail:${id}`);
    await clearCache("events:list");

    return response.data;
  }
}

const eventService = new EventService();
export default eventService;
