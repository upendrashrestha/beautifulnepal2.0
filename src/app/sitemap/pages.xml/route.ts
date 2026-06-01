// app/sitemap/pages.xml/route.ts
import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://beautifulnepal.com";

export async function GET(): Promise<Response> {
  const sitemap: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "daily" },
    {
      url: `${BASE_URL}/plan-your-trip`,
      priority: 0.95,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/contact`,
      priority: 0.9,
      changeFrequency: "yearly",
    },
    { url: `${BASE_URL}/blogs`, priority: 0.9, changeFrequency: "weekly" },
    {
      url: `${BASE_URL}/destinations`,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    { url: `${BASE_URL}/guides`, priority: 0.85, changeFrequency: "weekly" },
    { url: `${BASE_URL}/events`, priority: 0.85, changeFrequency: "daily" },
  ];

  return Response.json(sitemap);
}
