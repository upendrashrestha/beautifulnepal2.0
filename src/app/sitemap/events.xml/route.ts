// app/sitemap/events.xml/route.ts
import { MetadataRoute } from "next";
import eventService from "@/services/event.service";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://beautifulnepal.com";

export async function GET(): Promise<Response> {
  const sitemap: MetadataRoute.Sitemap = [];
  let page = 1;
  const pageSize = 200;

  while (true) {
    const res = await eventService.getEvents({
      pageIndex: page,
      pageSize,
      status: "Published",
    });

    res.data.forEach((e) => {
      sitemap.push({
        url: `${BASE_URL}/events/${e.slug}`,
        lastModified: new Date(e.updatedOn ?? e.createdOn).toISOString(),
        priority: 0.7,
        changeFrequency: "daily",
      });
    });

    if (res.data.length < pageSize) break;
    page++;
  }

  return Response.json(sitemap);
}
