export interface Slug {
  current: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: Slug;
}

export interface AffiliateLink {
  _id: string;
  title: string;
  url: string;
  vendor: string;
  relatedTo?: string; // could be destination id or slug
}

export interface Post {
  _id: string;
  title: string;
  slug: Slug;
  author?: Author;
  destination?: Destination;
  publishedAt?: string;
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  body?: any; // Portable Text type
  categories?: Category[];
  excerpt?: string;
}

export interface Guide {
  _id: string;
  title: string;
  slug: Slug;
  author?: Author;
  publishedAt?: string;
  destination?: Destination;
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  body?: any; // Portable Text type
  excerpt?: string;
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
  details?: any; // Portable Text type
  affiliateLinks?: AffiliateLink[];
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
  bio?: string;
  profileImage?: {
    asset: {
      url: string;
    };
  };
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
  termsAndConditions?: any;
  shortDescription?: string;
}
