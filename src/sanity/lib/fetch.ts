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
import { withCache } from "./redis-cache";
import { ITEM_PER_PAGE } from "@/utils/constant";
export function fetchPosts(): Promise<Post[]> {
  return withCache("posts", () =>
    client.fetch(`*[_type == "post"]{
      _id,
      title,
      slug,
      mainImage,
      author}`)
  );
}

export async function fetchFeaturedPosts() {
  const query = `*[_type == "post" && featured == true] | order(publishedAt desc){
    _id, title, slug, mainImage, excerpt
  }`;
  return withCache("featuredPosts", () => client.fetch(query));
}

export async function fetchFeaturedDestinations() {
  const query = `*[_type == "destination" && featured == true] | order(publishedAt desc){
    _id, name, slug, intro, heroImage
  }`;
  return withCache("featuredDestinations", () => client.fetch(query));
}

export function fetchGuides(): Promise<Guide[]> {
  return withCache("guides", () =>
    client.fetch(`*[_type == "guide"]{_id, title, slug, mainImage}`)
  );
}

export function fetchCommunityEvents(): Promise<CommunityEvent[]> {
  return withCache("events", () =>
    client.fetch(
      `*[_type == "event"]{_id, title, slug, location, eventDate, eventTime, createdAt}`
    )
  );
}
export function fetchCommunityEventBySlug(
  slug: string
): Promise<CommunityEvent> {
  {
    return withCache(`event:${slug}`, () =>
      client.fetch(`*[_type == "event" && slug.current == $slug][0]`, { slug })
    );
  }
}

export async function fetchFeaturedGuides() {
  const query = `*[_type == "guide" && featured == true] | order(publishedAt desc){
    _id, title, slug, mainImage, excerpt
  }`;
  return withCache("featuredGuides", () => client.fetch(query));
}

export function fetchCompanyAbout(): Promise<Company> {
  return withCache("companyAbout", () =>
    client.fetch(`*[_type == "company"][0]{description,shortDescription}`)
  );
}

export function fetchCompanyTerms(): Promise<Company> {
  return withCache("companyTerms", () =>
    client.fetch(`*[_type == "company"][0]{termsAndConditions}`)
  );
}

export function fetchCompany(): Promise<Company> {
  return withCache("company", () =>
    client.fetch(`*[_type == "company"][0]{name,
      phone,
      email,
      address,
      logo{
        asset->{_ref},
        alt
      },
      socialLinks[]->{
        name,
        link,
        logo{
          asset->{_ref}
          }
      },
      shortDescription
    }`)
  );
}

export function fetchDestinations(): Promise<Destination[]> {
  return withCache("destinations", () =>
    client.fetch(`*[_type == "destination"]{_id, name, slug, intro, heroImage}`)
  );
}

export function fetchCategories(): Promise<Category[]> {
  return withCache("categories", () =>
    client.fetch(`*[_type == "category"]{_id, title, slug}`)
  );
}

export function fetchPostBySlug(slug: string): Promise<Post> {
  return withCache(
    `post:${slug}`,
    () =>
      client.fetch(
        `*[_type == "post" && slug.current == $slug][0]{
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
        },
      }`,
        { slug }
      ),
    true
  );
}

export async function fetchPaginatedPosts(page: number) {
  const start = (page - 1) * ITEM_PER_PAGE;
  const end = start + ITEM_PER_PAGE;

  const posts = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) [${start}...${end}]{
      _id, title, slug, mainImage, excerpt, 
      publishedAt, 
      category->{ title },
       author ->{
          name, slug, image
          },
    }`
  );

  const total = await client.fetch(`count(*[_type == "post"])`);

  return {
    posts,
    total,
  };
}

export function fetchGuideBySlug(slug: string): Promise<Guide> {
  return withCache(`guide:${slug}`, () =>
    client.fetch(
      `*[_type == "guide" && slug.current == $slug][0]{
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

  const guides = await client.fetch(
    `*[_type == "guide"] | order(publishedAt desc) [${start}...${end}]{
      _id, title, slug, mainImage, excerpt, publishedAt
    }`
  );

  const total = await client.fetch(`count(*[_type == "guide"])`);

  return {
    guides,
    total,
  };
}

export function fetchDestinationBySlug(slug: string): Promise<Destination> {
  return withCache(`destination:${slug}`, () =>
    client.fetch(`*[_type == "destination" && slug.current == $slug][0]`, {
      slug,
    })
  );
}

export function fetchPostsByCategory(categorySlug: string): Promise<Post[]> {
  return withCache(`posts:category:${categorySlug}`, () =>
    client.fetch(
      `*[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)]`,
      { categorySlug }
    )
  );
}

export function fetchPostsByAuthor(authorSlug: string): Promise<Post[]> {
  return withCache(`posts:author:${authorSlug}`, () =>
    client.fetch(
      `*[_type == "post" && references(*[_type == "author" && slug.current == $authorSlug]._id)]`,
      { authorSlug }
    )
  );
}

export function fetchPostsByDestination(
  destinationSlug: string
): Promise<Post[]> {
  return withCache(`posts:destination:${destinationSlug}`, () =>
    client.fetch(
      `*[_type == "post" && references(*[_type == "destination" && slug.current == $destinationSlug]._id)]| order(publishedAt desc){
      _id, title, slug, mainImage, excerpt, 
      publishedAt, 
      category->{ title },
       author ->{
          name, slug, image
          },
    }`,
      { destinationSlug }
    )
  );
}

export function fetchGuidesByDestination(
  destinationSlug: string
): Promise<Guide[]> {
  return withCache(`guides:destination:${destinationSlug}`, () =>
    client.fetch(
      `*[_type == "guide" && references(*[_type == "destination" && slug.current == $destinationSlug]._id)] | order(publishedAt desc){
      _id, title, slug, mainImage, excerpt, 
      publishedAt, 
      category->{ title },
       author ->{
          name, slug, image
          },
    }`,
      { destinationSlug }
    )
  );
}

export function fetchPostsByDestinationAndCategory(
  destinationSlug: string,
  categorySlug: string
): Promise<Post[]> {
  return withCache(`posts:dest:${destinationSlug}:cat:${categorySlug}`, () =>
    client.fetch(
      `*[_type == "post" && references(*[_type == "destination" && slug.current == $destinationSlug]._id) && references(*[_type == "category" && slug.current == $categorySlug]._id)]`,
      { destinationSlug, categorySlug }
    )
  );
}

export function fetchAuthorBySlug(slug: string): Promise<Author> {
  return withCache(`author:${slug}`, () => {
    return client.fetch(
      `*[_type == "author" && slug.current == $slug][0]{_id, name, slug, bio, image}`,
      { slug }
    );
  });
}

export function fetchAuthors(): Promise<Author[]> {
  return withCache("authors", () =>
    client.fetch(`*[_type == "author"]{_id, name, slug, image}`)
  );
}
