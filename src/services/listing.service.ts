// services/listing.service.ts
import { Listing, ListingCreate, ListingUpdate } from "@/types/listing.types";
import api from "./api";
import { BaseSpecParams, PaginatedResponse } from "@/types";

const listingService = {
  getListings: async (
    params: BaseSpecParams,
  ): Promise<PaginatedResponse<Listing>> => {
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

    const res = await api.get<PaginatedResponse<Listing>>(
      `/listings/all?${query.toString()}`,
    );
    return res.data;
  },

  getListingById: async (id: string): Promise<Listing> => {
    const res = await api.get<Listing>(`/listings/listing/${id}`);
    return res.data;
  },

  getListingBySlug: async (slug: string): Promise<Listing> => {
    const res = await api.get<Listing>(`/listings/listing/${slug}`);
    return res.data;
  },

  createListing: async (data: Partial<ListingCreate>) => {
    const res = await api.post<Listing>("/listings", data);
    return res.data;
  },

  updateListing: async (data: Partial<ListingUpdate>) => {
    const res = await api.put<Listing>(`/listings/${data.id}`, data);
    return res.data;
  },

  deleteListing: async (id: string) => {
    const res = await api.delete(`/listings/delete/${id}`);
    return res.data;
  },

  importListing: async (listingUrl: string): Promise<Listing> => {
    const res = await api.get<Listing>(
      `/listings/import?listingUrl=${encodeURIComponent(listingUrl)}`,
    );
    return res.data;
  },

  // ================== VIEW COUNT METHODS ==================
  incrementViewCount: async (listingId: string): Promise<void> => {
    await api.post(`/listings/views/${listingId}`);
  },

  getViewCount: async (listingId: string): Promise<number> => {
    const res = await api.get<{ count: number }>(
      `/listings/views/${listingId}`,
    );
    return res.data.count;
  },
};

export default listingService;
