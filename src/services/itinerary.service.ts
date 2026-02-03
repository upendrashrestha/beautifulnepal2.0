// services/itinerary.service.ts
import api from "./api";
import { withCache, clearCache } from "@/utils/cache";
import { Itinerary } from "@/types/itinerary.types";

const itineraryService = {
  /** =====================
   * READ (cached)
   * ===================== */
  getItinerariesById: async (
    id: string,
    forceRefresh = false,
  ): Promise<Itinerary | null> => {
    return withCache(
      `itineraries:detail:${id}`,
      async () => {
        const res = await api.get<Itinerary>(`/itineraries/${id}`);
        return res.data;
      },
      forceRefresh,
      60 * 10, // 10 minutes
    );
  },

  /** =====================
   * WRITE (invalidate cache)
   * ===================== */
  createItinerary: async (data: Partial<Itinerary>): Promise<Itinerary> => {
    const res = await api.post<Itinerary>("/itineraries", data);

    // Invalidate list/detail caches if needed later
    if (res.data.id) {
      await clearCache(`itineraries:detail:${res.data.id}`);
    }

    return res.data;
  },

  updateItinerary: async (data: Partial<Itinerary>): Promise<Itinerary> => {
    if (!data.id) {
      throw new Error("Itinerary id is required for update");
    }

    const res = await api.put<Itinerary>(`/itineraries/${data.id}`, data);

    // Invalidate detail cache
    await clearCache(`itineraries:detail:${data.id}`);

    return res.data;
  },
};

export default itineraryService;
