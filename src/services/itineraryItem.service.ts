// services/itineraryItem.service.ts
import { ItineraryItem } from "@/types/itinerary.types";
import api from "./api";

const itineraryItemService = {
  updateItineraryItem: async (data: Partial<ItineraryItem>) => {
    const res = await api.put<ItineraryItem>("/itineraryitems", data);
    return res.data;
  },

  deleteItineraryItem: async (id: string) => {
    const res = await api.delete(`/itineraryitems/delete/${id}`);
    return res.data;
  },
};

export default itineraryItemService;
