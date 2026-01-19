import { PortableTextBlock } from "next-sanity";

export interface Slug {
  current: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: Slug;
  type?: string;
}

export interface AffiliateLink {
  _id: string;
  title: string;
  url: string;
  vendor: string;
  relatedTo?: string; // could be destination id or slug
}

export type Post = {
  publishedAt: string;
  _id: string;
  title: string;
  description: string | null;
  body: PortableTextBlock[];
  slug: { current: string; _type: "slug" };
  mainImage: {
    asset: {
      _ref: string;
      _type: string;
      alt: string | null;
    };
    _type: string;
  } | null;
  imageURL: string | null;
  _createdAt: string;
  excerpt?: string;
  type?: string; //
  author?: Author;
  categories?: Category[];
  destination?: Destination;
  featured: boolean;
  affiliateLinks?: AffiliateLink[];
};

export interface Guide {
  _id: string;
  title: string;
  slug: Slug;
  author?: Author;
  publishedAt: string;
  destination?: Destination;
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  body?: PortableTextBlock[]; // Portable Text type
  excerpt?: string;
  type?: string; // "blog" or "guide"
  featured: boolean;
}

export interface Destination {
  _id: string;
  name: string;
  slug: Slug;
  intro?: string;
  heroImage?: {
    asset: {
      url: string;
      _ref: string;
      alt?: string;
    };
  };
  details?: PortableTextBlock[];
  affiliateLinks?: AffiliateLink[];
  type?: string; // "blog" or "guide"
  publishedAt: string;
  featured: boolean;
}
export interface SocialLink {
  _id: string;
  name: string;
  link: string;
  logo?: {
    asset: {
      url: string;
      _ref: string;
    };
  };
}

export interface Author {
  _id: string;
  _ref: string;
  name: string;
  slug: Slug;
  bio?: PortableTextBlock[];
  image?: {
    asset: {
      url: string;
      _ref: string;
    };
  };
  publishedAt: string;
}

export interface BnMetadata {
  title: string;
  description: string;
  openGraphImageUrl?: string;
  keywords?: string;
  author?: string;
  publishedAt?: string;
}

export interface Company {
  _id: string;
  _type: "company";
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  slug?: Slug;
  logo?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  };
  description: string;
  socialLinks?: {
    name: string;
    link: string;
    logo?: {
      asset: {
        url: string;
        _ref: string;
      };
    };
  }[];
  termsAndConditions?: PortableTextBlock[];
  shortDescription?: string;
  publishedAt: string;
}

export type SearchQueryResult = {
  posts: Post[];
  destinations: Destination[];
  guides: Guide[];
  categories: Category[];
  events: CommunityEvent[];
};

export interface CommunityEvent {
  _id: string;
  title: string;
  location: string;
  eventDate: string;
  eventTime: string;
  eventEndDate: string;
  eventEndTime: string;
  description: string;
  organizerName: string;
  organizerEmail: string;
  website?: string;
  slug?: Slug;
  country?: string;
  createdAt: string;
  type?: string;
  image?: {
    asset: {
      alt: string;
      _ref: string;
    };
    alt?: string;
  };
}

export interface Login {
  userName?: string;
  email?: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  displayName?: string;
  userName?: string;
  phoneNumber?: string;
  role?: string;
  clientId?: string;
}

export interface ResetUserPassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  token: string;
  userName: string;
  clientId: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  clientName: string;
}

export interface RegisterUser {
  email: string;
  password?: string;
  displayName?: string;
  userName?: string;
  phoneNumber?: string;
  role?: string;
  clientId?: string;
  isActive: boolean;
  id?: string;
}

export interface ResetUserPassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  interestType?: string;
  phone?: string;
  source?: string;
  country?: string;
  destination?: string;
  travelMonth?: string;
  status: string;
  messages?: Message[];
}

export type LeadCreate = Omit<Lead, "id" | "messages">;

export type LeadUpdate = Omit<Lead, "messages">;

export interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface BaseSpecParams {
  pageIndex: number;
  pageSize: number;
  sort?: string;
  search?: string;
  id?: string; // Guid → string
  clientId?: string; // Guid → string
  publicId?: string;
  status?: string;
}

export interface Client {
  id: string;
  name: string;
  logoUrl?: string;
  bio?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  type?: string;
  sponsored: boolean;
  status: string;
  statusId: string;
  verified: boolean;
  hasUserAccess: boolean;
  isPrimary: boolean;
}

export interface LeadAssignment {
  leadId: string;
  clientId: string;
  remarks?: string;
  status: string;
}

export interface Message {
  id?: string;
  content: string;
  category: string;
  createdBy: string;
  createdOn?: string;
}

export interface NotificationPreference {
  leadAssigned: boolean;
  messageReceived: boolean;
  leadCreated: boolean;
}

export enum NotificationType {
  LeadAssigned = "LeadAssigned",
  MessageReceived = "MessageReceived",
  LeadCreated = "LeadCreated",
}

interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  clientId: string;
  userId?: string;
  createdOn: string;
}

/* =============================
   Event-specific payloads
   ============================= */

export interface LeadAssignedNotification extends BaseNotification {
  type: NotificationType.LeadAssigned;
  data: {
    leadId: string;
  };
}

export interface MessageReceivedNotification extends BaseNotification {
  type: NotificationType.MessageReceived;
  data: {
    messageId: string;
    fromUserId: string;
  };
}

export type NotificationEvent =
  | LeadAssignedNotification
  | MessageReceivedNotification;

export type MessageCreatedEvent = {
  Body: string;
  ClientId: string;
  CreatedOn: string;
  Data: string;
  Title: string;
  Type: string;
  UserId: string;
};
