// app/sitemap/content.xml/route.ts
import { MetadataRoute } from "next";
import { fetchPosts, fetchDestinations, fetchGuides } from "@/sanity/lib/fetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://beautifulnepal.com";

const formatDate = (d?: string) => new Date(d ?? Date.now()).toISOString();

export async function GET(): Promise<Response> {
  const [blogs, destinations, guides] = await Promise.all([
    fetchPosts(),
    fetchDestinations(),
    fetchGuides(),
  ]);

  const sitemap: MetadataRoute.Sitemap = [
    ...blogs.map((b) => ({
      url: `${BASE_URL}/blogs/${b.slug.current}`,
      lastModified: formatDate(b.publishedAt),
      priority: 0.8,
    })),
    ...destinations.map((d) => ({
      url: `${BASE_URL}/destinations/${d.slug.current}`,
      priority: 0.85,
    })),
    ...guides.map((g) => ({
      url: `${BASE_URL}/guides/${g.slug.current}`,
      priority: 0.75,
    })),
  ];

  return Response.json(sitemap);
}
