// app/sitemap.ts
import {
  fetchDestinations,
  fetchGuides,
  fetchPosts,
  fetchAuthors,
  fetchCompanyAbout,
  fetchCompanyTerms,
  fetchCommunityEvents,
} from "@/sanity/lib/fetch";
import { MetadataRoute } from "next";

// Helper to safely format ISO date
function formatDate(dateString?: string): string {
  if (!dateString) return new Date().toISOString();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://beautifulnepal.com";

  // Fetch all content
  const [blogs, destinations, guides, authors, companyAbout, companyTerms, events] =
    await Promise.all([
      fetchPosts(),
      fetchDestinations(),
      fetchGuides(),
      fetchAuthors(),
      fetchCompanyAbout(),
      fetchCompanyTerms(),
      fetchCommunityEvents(),
    ]);

  // Blogs
  const blogEntries: MetadataRoute.Sitemap = blogs
    .filter((b) => b?.slug?.current)
    .map((b) => ({
      url: `${baseUrl}/blogs/${b.slug.current}`,
      lastModified: formatDate(b.publishedAt),
      priority: 0.8,
      changeFrequency: "monthly",
    }));

  // Destinations
  const destinationEntries: MetadataRoute.Sitemap = destinations
    .filter((d) => d?.slug?.current)
    .map((d) => ({
      url: `${baseUrl}/destinations/${d.slug.current}`,
      lastModified: formatDate(d.publishedAt),
      priority: 0.8,
      changeFrequency: "weekly",
    }));

  // Guides
  const guideEntries: MetadataRoute.Sitemap = guides
    .filter((g) => g?.slug?.current)
    .map((g) => ({
      url: `${baseUrl}/guides/${g.slug.current}`,
      lastModified: formatDate(g.publishedAt),
      priority: 0.7,
      changeFrequency: "monthly",
    }));

  // Authors
  const authorEntries: MetadataRoute.Sitemap = authors
    .filter((a) => a?.slug?.current)
    .map((a) => ({
      url: `${baseUrl}/authors/${a.slug.current}`,
      lastModified: formatDate(a.publishedAt),
      priority: 0.6,
      changeFrequency: "yearly",
    }));

  // Community events
  const communityEventEntries: MetadataRoute.Sitemap = events
    .filter((e) => e?.slug?.current)
    .map((e) => ({
      url: `${baseUrl}/whats-happening/${e.slug?.current}`,
      lastModified: formatDate(e.createdAt),
      priority: 0.5,
      changeFrequency: "daily",
    }));

  // Company pages
  const companyEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: formatDate(companyAbout?.publishedAt),
      priority: 0.4,
      changeFrequency: "yearly",
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: formatDate(companyTerms?.publishedAt),
      priority: 0.1,
      changeFrequency: "yearly",
    },
  ];

  // Home and main pages
  const mainEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      priority: 1.0,
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/blogs`,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/destinations`,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/guides`,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/authors`,
      priority: 0.7,
      changeFrequency: "yearly",
    },
    {
      url: `${baseUrl}/whats-happening`,
      priority: 0.6,
      changeFrequency: "daily",
    },
  ];

  return [
    ...mainEntries,
    ...blogEntries,
    ...destinationEntries,
    ...guideEntries,
    ...authorEntries,
    ...companyEntries,
    ...communityEventEntries,
  ];
}
