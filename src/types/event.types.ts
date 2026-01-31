export interface Event {
  updatedOn: Date;
  createdOn: Date;
  id: string;
  title: string;
  street: string;
  city: string;
  content: string;
  type: string;
  metaData: string;
  pictureUrl: string;
  description: string;
  eventOn: string;
  eventOff?: string;
  eventOnTime?: string;
  eventOffTime?: string;
  organizedBy: string;
  organizerEmail: string;
  slug: string;
  status: string;
  views: number;
}

export type EventCreate = Omit<Event, "id">;

export interface EventFormData {
  title: string;
  street: string;
  city: string;
  content: string;
  type: string;
  pictureUrl?: string;
  description: string;
  eventOn: string;
  eventOff: string;
  eventOnTime: string;
  eventOffTime: string;
  organizedBy: string;
  organizerEmail: string;
}

export interface EventSpecParams {
  pageIndex: number;
  pageSize: number;
  sort?: string;
  search?: string;
  id?: string; // Guid → string
  publicId?: string;
  status?: string;
  type?: string;
  eventOn?: string;
  city?: string;
  timeFilter?: "all" | "today" | "weekend" | "popular";
  slug?: string;
}
