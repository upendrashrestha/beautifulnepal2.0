// lib/fetch.ts
import {
  Author,
  Category,
  CommunityEvent,
  Company,
  Destination,
  Guide,
  Post,
} from "@/types";
import { client } from "./client";
import { ITEM_PER_PAGE } from "@/utils/constant";
import { withCache } from "./redis-cache";
import { redirect } from "next/navigation";

async function safeSanityFetch<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (isSanityQuotaError(error)) {
      redirect("/traffic-limit");
    }

    throw error;
  }
}

function isSanityQuotaError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const maybeError = error as {
    statusCode?: number;
    responseBody?: string;
  };

  return (
    maybeError.statusCode === 402 ||
    maybeError.responseBody?.includes("plan_limit_reached") === true
  );
}

// -------------------------
// FIELD CONSTANTS
// -------------------------

const POST_FIELDS =
  "_id, title, slug, mainImage, excerpt, publishedAt, author->{name, slug, image}, category->{title}";
const GUIDE_FIELDS =
  "_id, title, slug, mainImage, excerpt, publishedAt, author->{name, slug}";

// -------------------------
// POSTS
// -------------------------

export function fetchPosts(): Promise<Post[]> {
  return withCache<Post[]>("posts", () =>
    safeSanityFetch(() => client.fetch(`*[_type=="post"]{${POST_FIELDS}}`)),
  );
}

export function fetchFeaturedPosts(): Promise<Post[]> {
  return withCache<Post[]>("featuredPosts", () =>
    safeSanityFetch(() =>
      client.fetch(
        `*[_type=="post" && featured==true] | order(publishedAt desc){${POST_FIELDS}}`,
      ),
    ),
  );
}

export function fetchPostBySlug(slug: string): Promise<Post> {
  return withCache<Post>(`post:${slug}`, () =>
    safeSanityFetch(() =>
      client.fetch(
        `*[_type=="post" && slug.current==$slug][0]{
        title,
        body,
        mainImage,
        categories[]->{ title },
        publishedAt,
        destination->{ name },
        excerpt,
        author->{
          name,
          slug,
          image
        },
        affiliateLinks[]->{
          title,
          url,
          vendor
        }
      }`,
        { slug },
      ),
    ),
  );
}

export async function fetchPaginatedPosts(page: number) {
  return withCache(`posts:page:${page}`, async () => {
    const start = (page - 1) * ITEM_PER_PAGE;
    const end = start + ITEM_PER_PAGE;

    const [posts, total] = await Promise.all([
      safeSanityFetch(() =>
        client.fetch<Post[]>(
          `*[_type=="post"] | order(publishedAt desc) [${start}...${end}]{${POST_FIELDS}}`,
        ),
      ),
      safeSanityFetch(() => client.fetch<number>(`count(*[_type=="post"])`)),
    ]);

    return { posts, total };
  });
}

// -------------------------
// POSTS FILTERS
// -------------------------

export function fetchPostsByCategory(categorySlug: string): Promise<Post[]> {
  return withCache<Post[]>(`posts:category:${categorySlug}`, () =>
    safeSanityFetch(() =>
      client.fetch(
        `*[_type=="post" && references(*[_type=="category" && slug.current==$categorySlug]._id)]{${POST_FIELDS}}`,
        { categorySlug },
      ),
    ),
  );
}

export function fetchPostsByAuthor(authorSlug: string): Promise<Post[]> {
  return withCache<Post[]>(`posts:author:${authorSlug}`, () =>
    safeSanityFetch(() =>
      client.fetch(
        `*[_type=="post" && references(*[_type=="author" && slug.current==$authorSlug]._id)]{${POST_FIELDS}}`,
        { authorSlug },
      ),
    ),
  );
}

export function fetchPostsByDestination(
  destinationSlug: string,
): Promise<Post[]> {
  return withCache<Post[]>(`posts:destination:${destinationSlug}`, () =>
    safeSanityFetch(() =>
      client.fetch(
        `*[_type=="post" && references(*[_type=="destination" && slug.current==$destinationSlug]._id)] | order(publishedAt desc){${POST_FIELDS}}`,
        { destinationSlug },
      ),
    ),
  );
}

export function fetchPostsByDestinationAndCategory(
  destinationSlug: string,
  categorySlug: string,
): Promise<Post[]> {
  return withCache<Post[]>(
    `posts:dest:${destinationSlug}:cat:${categorySlug}`,
    () =>
      safeSanityFetch(() =>
        client.fetch(
          `*[_type=="post" && references(*[_type=="destination" && slug.current==$destinationSlug]._id) && references(*[_type=="category" && slug.current==$categorySlug]._id)]{${POST_FIELDS}}`,
          { destinationSlug, categorySlug },
        ),
      ),
  );
}

// -------------------------
// GUIDES
// -------------------------

export function fetchGuides(): Promise<Guide[]> {
  return withCache<Guide[]>("guides", () =>
    safeSanityFetch(() =>
      client.fetch<Guide[]>(
        `*[_type=="guide"] | order(publishedAt desc){${GUIDE_FIELDS}}`,
      ),
    ),
  );
}

export function fetchGuideBySlug(slug: string): Promise<Guide> {
  return withCache<Guide>(`guide:${slug}`, () =>
    safeSanityFetch(() =>
      client.fetch(
        `*[_type=="guide" && slug.current==$slug][0]{
        title,
        body,
        mainImage,
        publishedAt,
        excerpt,
        destination->{ name, slug },
        author->{ name, slug }
      }`,
        { slug },
      ),
    ),
  );
}

export async function fetchPaginatedGuides(page: number) {
  const start = (page - 1) * ITEM_PER_PAGE;
  const end = start + ITEM_PER_PAGE;

  const [guides, total] = await Promise.all([
    safeSanityFetch(() =>
      client.fetch<Guide[]>(
        `*[_type=="guide"] | order(publishedAt desc) [${start}...${end}]{${GUIDE_FIELDS}}`,
      ),
    ),
    safeSanityFetch(() => client.fetch<number>(`count(*[_type=="guide"])`)),
  ]);

  return { guides, total };
}

export function fetchFeaturedGuides(): Promise<Guide[]> {
  return withCache<Guide[]>("featuredGuides", () =>
    safeSanityFetch(() =>
      client.fetch<Guide[]>(
        `*[_type=="guide" && featured==true] | order(publishedAt desc){${GUIDE_FIELDS}}`,
      ),
    ),
  );
}

export function fetchGuidesByDestination(
  destinationSlug: string,
): Promise<Guide[]> {
  return withCache<Guide[]>(`guides:destination:${destinationSlug}`, () =>
    safeSanityFetch(() =>
      client.fetch(
        `*[_type=="guide" && references(*[_type=="destination" && slug.current==$destinationSlug]._id)] | order(publishedAt desc){${GUIDE_FIELDS}}`,
        { destinationSlug },
      ),
    ),
  );
}

// -------------------------
// DESTINATIONS
// -------------------------

export function fetchDestinations(): Promise<Destination[]> {
  return withCache<Destination[]>(`destinations`, () =>
    safeSanityFetch(() =>
      client.fetch<Destination[]>(
        `*[_type=="destination"]{_id, name, slug, intro, heroImage}`,
      ),
    ),
  );
}

export function fetchDestinationBySlug(slug: string): Promise<Destination> {
  return withCache<Destination>(`destination:${slug}`, () =>
    safeSanityFetch(() =>
      client.fetch<Destination>(
        `*[_type=="destination" && slug.current==$slug][0]`,
        { slug },
      ),
    ),
  );
}

export function fetchFeaturedDestinations(): Promise<Destination[]> {
  return withCache<Destination[]>(`featuredDestinations`, () =>
    safeSanityFetch(() =>
      client.fetch<Destination[]>(
        `*[_type=="destination" && featured==true] | order(publishedAt desc){_id, name, slug, intro, heroImage}`,
      ),
    ),
  );
}

// -------------------------
// AUTHORS
// -------------------------

export function fetchAuthors(): Promise<Author[]> {
  return withCache<Author[]>(`authors`, () =>
    safeSanityFetch(() =>
      client.fetch<Author[]>(`*[_type=="author"]{_id, name, slug, image}`),
    ),
  );
}

export function fetchAuthorBySlug(slug: string): Promise<Author> {
  return withCache<Author>(`author:${slug}`, () =>
    safeSanityFetch(() =>
      client.fetch<Author>(
        `*[_type=="author" && slug.current==$slug][0]{_id, name, slug, bio, image}`,
        { slug },
      ),
    ),
  );
}

// -------------------------
// CATEGORIES
// -------------------------

export function fetchCategories(): Promise<Category[]> {
  return withCache<Category[]>(`categories`, () =>
    safeSanityFetch(() =>
      client.fetch<Category[]>(`*[_type=="category"]{_id, title, slug}`),
    ),
  );
}

// -------------------------
// COMPANY
// -------------------------

export function fetchCompany(): Promise<Company> {
  return withCache<Company>(`company`, () =>
    safeSanityFetch(() =>
      client.fetch<Company>(
        `*[_type=="company"][0]{name, phone, email, address, logo{asset->{_ref}, alt}, socialLinks[]->{name, link, logo{asset->{_ref}}}, shortDescription}`,
      ),
    ),
  );
}

export function fetchCompanyAbout(): Promise<Company> {
  return withCache<Company>(`companyAbout`, () =>
    safeSanityFetch(() =>
      client.fetch<Company>(
        `*[_type=="company"][0]{description, shortDescription}`,
      ),
    ),
  );
}

export function fetchCompanyTerms(): Promise<Company> {
  return withCache<Company>(`companyTerms`, () =>
    safeSanityFetch(() =>
      client.fetch<Company>(`*[_type=="company"][0]{termsAndConditions}`),
    ),
  );
}

// -------------------------
// COMMUNITY EVENTS
// -------------------------

export function fetchCommunityEvents(): Promise<CommunityEvent[]> {
  return withCache<CommunityEvent[]>(`events`, () =>
    safeSanityFetch(() =>
      client.fetch<CommunityEvent[]>(
        `*[_type=="event"]{_id, title, slug, location, eventDate, eventTime, eventEndDate, eventEndTime, createdAt, image}`,
      ),
    ),
  );
}

export function fetchCommunityEventBySlug(
  slug: string,
): Promise<CommunityEvent> {
  return withCache<CommunityEvent>(`event:${slug}`, () =>
    safeSanityFetch(() =>
      client.fetch<CommunityEvent>(
        `*[_type=="event" && slug.current==$slug][0]`,
        { slug },
      ),
    ),
  );
}
