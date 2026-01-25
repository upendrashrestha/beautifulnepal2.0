// types/listing.types.ts

import { BaseSpecParams } from ".";
import { Itinerary } from "./itinerary.types";

export interface Listing {
  id: string;
  publicId: string;
  title: string;
  description: string;
  keywords?: string;
  price: number;
  currency?: string;
  pictureUrl?: string;
  externalUrl?: string;
  slug?: string;
  location?: string;
  listingType?: string;
  clientId: string;
  statusId?: string;
  itineraryId?: string;
  activationDate?: string; // ISO string
  expirationDate?: string; // ISO string
  createdOn?: string;
  createdBy?: string;
  viewCount?: number;
  itinerary?: Itinerary | null;
}

export type ListingCreate = Omit<
  Listing,
  "id" | "publicId" | "createdOn" | "viewCount" | "clientId" | "createdBy"
>;

export type ListingUpdate = Omit<
  Listing,
  "publicId" | "createdOn" | "viewCount" | "createdBy"
>;

export interface ThumbnailData {
  id: string;
  publicId: string;
  title: string;
  pictureUrl?: string;
  price: number;
  location?: string;
  viewCount?: number;
}

export interface ListingSpecParams extends BaseSpecParams {
  listingId?: string;
}

export interface ListingView {
  id: string;
  listingId: string;
  userId?: string; // optional if logged-in
  viewedOn: string; // ISO date string
}

export enum ListingType {
  Adventure = "Adventure",
  Relaxation = "Relaxation",
  Cultural = "Cultural",
  Family = "Family",
  Luxury = "Luxury",
  Spiritual = "Spiritual",
  Expedition = "Expedition",
  Hike = "Hike",
  Trek = "Trek",
  MountainFlight = "MountainFlight",
  HelicopterRide = "HelicopterRide",
  Tour = "Tour",
  Others = "Others",
}
