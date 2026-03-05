// types/itinerary.types.ts

import { BaseSpecParams } from ".";

export interface Itinerary {
  id?: string;
  listingId?: string;
  duration?: string;
  difficultyLevel?: string;
  createdOn?: string;
  createdBy?: string;
  items?: ItineraryItem[];
}

export interface ItineraryItem {
  id?: string;
  itineraryId?: string;
  day?: string;
  title: string;
  description?: string;
  time?: string;
  accomodation?: string;
  meals?: string;
  commute?: string;
  createdOn?: string;
  createdBy?: string;
}

export interface ItinerarySpecParams extends BaseSpecParams {
  listingId?: string;
  searchDate?: string; // optional filter by activation/expiration
}
