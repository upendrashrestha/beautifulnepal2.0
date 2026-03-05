// services/listing.server.ts
import { Listing } from "../../types/listing.types";
import { PaginatedResponse } from "../../types";

interface ListParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  clientId?: string;
  sort?: string;
}

/**
 * Get paginated listings (SERVER ONLY)
 */
export async function getListingsServer(
  params: ListParams,
): Promise<PaginatedResponse<Listing>> {
  const query = new URLSearchParams();

  if (params.pageIndex) query.append("PageIndex", params.pageIndex.toString());
  if (params.pageSize) query.append("PageSize", params.pageSize.toString());
  if (params.search) query.append("Search", params.search);
  if (params.status) query.append("Status", params.status);
  if (params.clientId) query.append("ClientId", params.clientId);
  if (params.sort) query.append("Sort", params.sort);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/listings?${query.toString()}`,
    {
      cache: "no-store", // good default for admin/content pages
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }

  return res.json();
}

/**
 * Get listing by slug (SERVER ONLY)
 */
export async function getListingBySlugServer(slug: string): Promise<Listing> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/listings/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (res.status === 404) {
    throw new Error("Listing not found");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch listing");
  }

  return res.json();
}
