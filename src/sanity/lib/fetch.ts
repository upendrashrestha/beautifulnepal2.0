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
    client.fetch(`*[_type=="post"]{${POST_FIELDS}}`)
  );
}

export function fetchFeaturedPosts(): Promise<Post[]> {
  return withCache<Post[]>("featuredPosts", () =>
    client.fetch(
      `*[_type=="post" && featured==true] | order(publishedAt desc){${POST_FIELDS}}`
    )
  );
}

export function fetchPostBySlug(slug: string): Promise<Post> {
  return withCache<Post>(`post:${slug}`, () =>
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
      { slug }
    )
  );
}

export async function fetchPaginatedPosts(page: number) {
  const start = (page - 1) * ITEM_PER_PAGE;
  const end = start + ITEM_PER_PAGE;

  const [posts, total] = await Promise.all([
    client.fetch<Post[]>(
      `*[_type=="post"] | order(publishedAt desc) [${start}...${end}]{${POST_FIELDS}}`
    ),
    client.fetch<number>(`count(*[_type=="post"])`),
  ]);

  return { posts, total };
}

// -------------------------
// POSTS FILTERS
// -------------------------

export function fetchPostsByCategory(categorySlug: string): Promise<Post[]> {
  return withCache<Post[]>(`posts:category:${categorySlug}`, () =>
    client.fetch(
      `*[_type=="post" && references(*[_type=="category" && slug.current==$categorySlug]._id)]{${POST_FIELDS}}`,
      { categorySlug }
    )
  );
}

export function fetchPostsByAuthor(authorSlug: string): Promise<Post[]> {
  return withCache<Post[]>(`posts:author:${authorSlug}`, () =>
    client.fetch(
      `*[_type=="post" && references(*[_type=="author" && slug.current==$authorSlug]._id)]{${POST_FIELDS}}`,
      { authorSlug }
    )
  );
}

export function fetchPostsByDestination(destinationSlug: string): Promise<Post[]> {
  return withCache<Post[]>(`posts:destination:${destinationSlug}`, () =>
    client.fetch(
      `*[_type=="post" && references(*[_type=="destination" && slug.current==$destinationSlug]._id)] | order(publishedAt desc){${POST_FIELDS}}`,
      { destinationSlug }
    )
  );
}

export function fetchPostsByDestinationAndCategory(
  destinationSlug: string,
  categorySlug: string
): Promise<Post[]> {
  return withCache<Post[]>(`posts:dest:${destinationSlug}:cat:${categorySlug}`, () =>
    client.fetch(
      `*[_type=="post" && references(*[_type=="destination" && slug.current==$destinationSlug]._id) && references(*[_type=="category" && slug.current==$categorySlug]._id)]{${POST_FIELDS}}`,
      { destinationSlug, categorySlug }
    )
  );
}

// -------------------------
// GUIDES
// -------------------------

export function fetchGuides(): Promise<Guide[]> {
  return withCache<Guide[]>("guides", () =>
    client.fetch<Guide[]>(`*[_type=="guide"] | order(publishedAt desc){${GUIDE_FIELDS}}`)
  );
}

export function fetchGuideBySlug(slug: string): Promise<Guide> {
  return withCache<Guide>(`guide:${slug}`, () =>
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
      { slug }
    )
  );
}

export async function fetchPaginatedGuides(page: number) {
  const start = (page - 1) * ITEM_PER_PAGE;
  const end = start + ITEM_PER_PAGE;

  const [guides, total] = await Promise.all([
    client.fetch<Guide[]>(
      `*[_type=="guide"] | order(publishedAt desc) [${start}...${end}]{${GUIDE_FIELDS}}`
    ),
    client.fetch<number>(`count(*[_type=="guide"])`),
  ]);

  return { guides, total };
}

export function fetchFeaturedGuides(): Promise<Guide[]> {
  return withCache<Guide[]>("featuredGuides", () =>
    client.fetch<Guide[]>(
      `*[_type=="guide" && featured==true] | order(publishedAt desc){${GUIDE_FIELDS}}`
    )
  );
}

export function fetchGuidesByDestination(destinationSlug: string): Promise<Guide[]> {
  return withCache<Guide[]>(`guides:destination:${destinationSlug}`, () =>
    client.fetch(
      `*[_type=="guide" && references(*[_type=="destination" && slug.current==$destinationSlug]._id)] | order(publishedAt desc){${GUIDE_FIELDS}}`,
      { destinationSlug }
    )
  );
}

// -------------------------
// DESTINATIONS
// -------------------------

export function fetchDestinations(): Promise<Destination[]> {
  return withCache<Destination[]>(`destinations`, () =>
    client.fetch<Destination[]>(`*[_type=="destination"]{_id, name, slug, intro, heroImage}`)
  );
}

export function fetchDestinationBySlug(slug: string): Promise<Destination> {
  return withCache<Destination>(`destination:${slug}`, () =>
    client.fetch<Destination>(`*[_type=="destination" && slug.current==$slug][0]`, { slug })
  );
}

export function fetchFeaturedDestinations(): Promise<Destination[]> {
  return withCache<Destination[]>(`featuredDestinations`, () =>
    client.fetch<Destination[]>(
      `*[_type=="destination" && featured==true] | order(publishedAt desc){_id, name, slug, intro, heroImage}`
    )
  );
}


// -------------------------
// AUTHORS
// -------------------------

export function fetchAuthors(): Promise<Author[]> {
  return withCache<Author[]>(`authors`, () =>
    client.fetch<Author[]>(`*[_type=="author"]{_id, name, slug, image}`)
  );
}

export function fetchAuthorBySlug(slug: string): Promise<Author> {
  return withCache<Author>(`author:${slug}`, () =>
    client.fetch<Author>(
      `*[_type=="author" && slug.current==$slug][0]{_id, name, slug, bio, image}`,
      { slug }
    )
  );
}

// -------------------------
// CATEGORIES
// -------------------------

export function fetchCategories(): Promise<Category[]> {
  return withCache<Category[]>(`categories`, () =>
    client.fetch<Category[]>(`*[_type=="category"]{_id, title, slug}`)
  );
}

// -------------------------
// COMPANY
// -------------------------

export function fetchCompany(): Promise<Company> {
  return withCache<Company>(`company`, () =>
    client.fetch<Company>(
      `*[_type=="company"][0]{name, phone, email, address, logo{asset->{_ref}, alt}, socialLinks[]->{name, link, logo{asset->{_ref}}}, shortDescription}`
    )
  );
}

export function fetchCompanyAbout(): Promise<Company> {
  return withCache<Company>(`companyAbout`, () =>
    client.fetch<Company>(`*[_type=="company"][0]{description, shortDescription}`)
  );
}

export function fetchCompanyTerms(): Promise<Company> {
  return withCache<Company>(`companyTerms`, () =>
    client.fetch<Company>(`*[_type=="company"][0]{termsAndConditions}`)
  );
}

// -------------------------
// COMMUNITY EVENTS
// -------------------------

export function fetchCommunityEvents(): Promise<CommunityEvent[]> {
  return withCache<CommunityEvent[]>(`events`, () =>
    client.fetch<CommunityEvent[]>(
      `*[_type=="event"]{_id, title, slug, location, eventDate, eventTime, eventEndDate, eventEndTime, createdAt, image}`
    )
  );
}

export function fetchCommunityEventBySlug(slug: string): Promise<CommunityEvent> {
  return withCache<CommunityEvent>(`event:${slug}`, () =>
    client.fetch<CommunityEvent>(`*[_type=="event" && slug.current==$slug][0]`, { slug })
  );
}
