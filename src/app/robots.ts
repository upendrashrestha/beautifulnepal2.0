// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://beautifulnepal.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/", // allow all main pages
        disallow: ["/sanitystudio", "/dashboard", "/login"], // block admin/studio
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl, // optional but recommended
  };
}
