import { Author, Category, Company, Destination, Guide, Post } from "@/types";
import { client } from "./client";
import { withCache } from "./cache";
import { ITEM_PER_PAGE } from "@/util/constant";

export function fetchPosts(): Promise<Post[]> {
  return withCache(
    "posts",
    () => client.fetch(`*[_type == "post"]{_id, title, slug, mainImage}`),
    true
  );
}

export function fetchGuides(): Promise<Guide[]> {
  return withCache(
    "guides",
    () => client.fetch(`*[_type == "guide"]{_id, title, slug, mainImage}`),
    true
  );
}

export function fetchCompanyAbout(): Promise<Company> {
  return withCache(
    "companyAbout",
    () =>
      client.fetch(`*[_type == "company"][0]{description,shortDescription}`),
    false
  );
}

export function fetchCompanyTerms(): Promise<Company> {
  return withCache(
    "companyTerms",
    () => client.fetch(`*[_type == "company"][0]{termsAndConditions}`),
    false
  );
}

export function fetchCompany(): Promise<Company> {
  return withCache(
    "company",
    () =>
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
    }`),
    true
  );
}

export function fetchDestinations(): Promise<Destination[]> {
  return withCache(
    "destinations",
    () =>
      client.fetch(
        `*[_type == "destination"]{_id, name, slug, intro, heroImage}`
      ),
    true
  );
}

export function fetchCategories(): Promise<Category[]> {
  return withCache("categories", () =>
    client.fetch(`*[_type == "category"]{_id, title, slug}`)
  );
}

export function fetchPostBySlug(slug: string): Promise<Post> {
  return withCache(`post:${slug}`, () =>
    client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        body,
        mainImage,
        categories[]->{ title },
        publishedAt,
        destination->{ name },
        excerpt,
        author->{ name }
      }`,
      { slug }
    )
  );
}

export async function fetchPaginatedPosts(page: number) {
  const start = (page - 1) * ITEM_PER_PAGE;
  const end = start + ITEM_PER_PAGE;

  const posts = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) [${start}...${end}]{
      _id, title, slug, mainImage, excerpt, publishedAt, category->{ title }
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
        destination->{ name },
        author->{ name }
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
): Promise<Destination[]> {
  return withCache(`posts:destination:${destinationSlug}`, () =>
    client.fetch(
      `*[_type == "post" && references(*[_type == "destination" && slug.current == $destinationSlug]._id)]`,
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

export function fetchAuthorByRef(refId: string): Promise<Author | null> {
  return withCache(`author:${refId}`, async () => {
    const query = `*[_type == "author" && _id == $refId][0]{_id, name, image{asset->{url}}}`;
    try {
      const author = await client.fetch(query, { refId });
      return author || null;
    } catch (error) {
      console.error("Failed to fetch author by reference:", error);
      return null;
    }
  });
}
