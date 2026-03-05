// services/listing.service.ts
import {
  Listing,
  ListingCreate,
  ListingUpdate,
} from "../../types/listing.types";
import api from "./api";
import { BaseSpecParams, PaginatedResponse } from "../../types";
import { withCache, clearCache } from "@/utils/cache";

const listingService = {
  /** =====================
   * LIST (cached)
   * ===================== */
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

    const cacheKey = `listings:list:${query.toString()}`;

    return withCache(cacheKey, async () => {
      const res = await api.get<PaginatedResponse<Listing>>(
        `/listings/all?${query.toString()}`,
      );
      return res.data;
    });
  },

  /** =====================
   * DETAIL BY ID (cached)
   * ===================== */
  getListingById: async (id: string): Promise<Listing> => {
    const cacheKey = `listings:detail:${id}`;

    return withCache(cacheKey, async () => {
      const res = await api.get<Listing>(`/listings/listing/${id}`);
      return res.data;
    });
  },

  /** =====================
   * DETAIL BY SLUG (cached)
   * ===================== */
  getListingBySlug: async (slug: string): Promise<Listing> => {
    const cacheKey = `listings:slug:${slug}`;

    return withCache(cacheKey, async () => {
      const res = await api.get<Listing>(`/listings/listing/${slug}`);
      return res.data;
    });
  },

  /** =====================
   * CREATE (invalidate)
   * ===================== */
  createListing: async (data: Partial<ListingCreate>) => {
    const res = await api.post<Listing>("/listings", data);

    await clearCache("listings:list:");

    return res.data;
  },

  /** =====================
   * UPDATE (invalidate)
   * ===================== */
  updateListing: async (data: Partial<ListingUpdate>) => {
    const res = await api.put<Listing>(`/listings/${data.id}`, data);

    await clearCache(`listings:detail:${data.id}`);
    await clearCache("listings:list:");

    return res.data;
  },

  /** =====================
   * DELETE (invalidate)
   * ===================== */
  deleteListing: async (id: string) => {
    const res = await api.delete(`/listings/delete/${id}`);

    await clearCache(`listings:detail:${id}`);
    await clearCache("listings:list:");

    return res.data;
  },

  /** =====================
   * IMPORT (invalidate)
   * ===================== */
  importListing: async (listingUrl: string): Promise<Listing> => {
    const res = await api.get<Listing>(
      `/listings/import?listingUrl=${encodeURIComponent(listingUrl)}`,
    );

    await clearCache("listings:list:");

    return res.data;
  },

  /** =====================
   * VIEW COUNT
   * ===================== */
  incrementViewCount: async (listingId: string): Promise<void> => {
    await api.post(`/listings/views/${listingId}`);

    // optional: invalidate detail cache so count refreshes
    await clearCache(`listings:detail:${listingId}`);
  },

  getViewCount: async (listingId: string): Promise<number> => {
    const cacheKey = `listings:views:${listingId}`;

    return withCache(
      cacheKey,
      async () => {
        const res = await api.get<{ count: number }>(
          `/listings/views/${listingId}`,
        );
        return res.data.count;
      },
      false,
      60,
    ); // short TTL (1 min)
  },
};

export default listingService;
