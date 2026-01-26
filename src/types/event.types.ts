
export interface Event {
  id: string;
  title: string;
  location: string;
  content: string;
  keywords: string;
  metaData: string;
  pictureUrl: string;
  description: string;
  eventOn: string;
  eventOff?: string;
  eventOnTime?: string;
  eventOffTime?: string;
  organizedBy: string;
}

export type EventCreate = Omit<Event, "id">;

export interface EventFormData {
  title: string;
  streetAddress: string;
  city: string;
  content: string;
  keywords: string;
  metaData: string;
  pictureUrl: string;
  description: string;
  eventOn: string;
  eventOff: string;
  eventOnTime: string;
  eventOffTime: string;
  organizedBy: string;
}