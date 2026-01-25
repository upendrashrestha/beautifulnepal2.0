// services/itinerary.service.ts
import { Itinerary } from "@/types/itinerary.types";
import api from "./api";

const itineraryService = {
  getItinerariesById: async (id: string): Promise<Itinerary | null> => {
    const res = await api.get<Itinerary>(`/itineraries/${id}`);
    return res.data;
  },

  createItinerary: async (data: Partial<Itinerary>) => {
    const res = await api.post<Itinerary>("/itineraries", data);
    return res.data;
  },

  updateItinerary: async (data: Partial<Itinerary>) => {
    const res = await api.put<Itinerary>(`/itineraries/${data.id}`, data);
    return res.data;
  },
};

export default itineraryService;
