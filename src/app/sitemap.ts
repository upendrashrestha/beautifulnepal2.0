// app/sitemap.ts
import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://beautifulnepal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/sitemap/pages.xml` },
    { url: `${BASE_URL}/sitemap/content.xml` },
    { url: `${BASE_URL}/sitemap/events.xml` },
    { url: `${BASE_URL}/sitemap/images.xml` },
  ];
}
