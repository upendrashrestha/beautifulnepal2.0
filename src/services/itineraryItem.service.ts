// services/itineraryItem.service.ts
import api from "./api";
import { clearCache } from "@/utils/cache";
import { ItineraryItem } from "@/types/itinerary.types";

const itineraryItemService = {
  /** =====================
   * UPDATE (invalidate cache)
   * ===================== */
  updateItineraryItem: async (
    data: Partial<ItineraryItem>,
  ): Promise<ItineraryItem> => {
    if (!data.itineraryId) {
      throw new Error("itineraryId is required to update itinerary item");
    }

    const res = await api.put<ItineraryItem>("/itineraryitems", data);

    // Invalidate parent itinerary cache
    await clearCache(`itineraries:detail:${data.itineraryId}`);

    return res.data;
  },

  /** =====================
   * DELETE (invalidate cache)
   * ===================== */
  deleteItineraryItem: async (
    id: string,
    itineraryId: string,
  ): Promise<void> => {
    await api.delete(`/itineraryitems/delete/${id}`);

    // Invalidate parent itinerary cache
    await clearCache(`itineraries:detail:${itineraryId}`);
  },
};

export default itineraryItemService;
