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

function formatDate(dateString?: string): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://beautifulnepal.com";

  const blogs = await fetchPosts();
  const destinations = await fetchDestinations();
  const guides = await fetchGuides();
  const authors = await fetchAuthors();
  const companyAbout = await fetchCompanyAbout();
  const companyTerms = await fetchCompanyTerms();
  const communityEvents = await fetchCommunityEvents();

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug.current}`,
    lastModified: formatDate(blog.publishedAt) || new Date().toISOString(),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const destinationEntries: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${baseUrl}/destinations/${d.slug.current}`,
    lastModified: formatDate(d.publishedAt) || new Date().toISOString(),
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${baseUrl}/guides/${g.slug.current}`,
    lastModified: formatDate(g.publishedAt) || new Date().toISOString(),
    priority: 0.8,
    changeFrequency: "yearly",
  }));

  const authorEntries: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${baseUrl}/guides/${a.slug.current}`,
    lastModified: formatDate(a.publishedAt) || new Date().toISOString(),
    priority: 0.8,
    changeFrequency: "yearly",
  }));

  const communityEventEntries: MetadataRoute.Sitemap = communityEvents
    .filter((e) => e && e.slug && e.slug.current)
    .map((e) => ({
      url: `${baseUrl}/whats-happening/${e.slug?.current}`,
      lastModified: formatDate(e.createdAt) || new Date().toISOString(),
      priority: 0.5,
      changeFrequency: "daily",
    }));

  const companyEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified:
        formatDate(companyAbout.publishedAt) || new Date().toISOString(),
      priority: 0.1,
      changeFrequency: "yearly",
    },
    {
      url: `${baseUrl}/terms`,
      lastModified:
        formatDate(companyTerms.publishedAt) || new Date().toISOString(),
      priority: 0.1,
      changeFrequency: "yearly",
    },
  ];

  return [
    {
      url: baseUrl,
      priority: 1,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/blogs`,
      //lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "weekly",
    },
    ...blogEntries,
    ...destinationEntries,
    ...guideEntries,
    ...authorEntries,
    ...companyEntries,
    ...communityEventEntries,
  ];
}
