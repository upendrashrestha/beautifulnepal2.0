// app/sitemap/images.xml/route.ts
import { fetchPosts, fetchDestinations, fetchGuides } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://beautifulnepal.com";

export async function GET(): Promise<Response> {
  const [blogs, destinations, guides] = await Promise.all([
    fetchPosts(),
    fetchDestinations(),
    fetchGuides(),
  ]);

  const urls = [];

  for (const b of blogs) {
    if (b.mainImage?.asset?._ref) {
      urls.push({
        loc: `${BASE_URL}/blogs/${b.slug.current}`,
        image: [{ loc: urlFor(b.mainImage.asset._ref).url() }],
      });
    }
  }

  for (const d of destinations) {
    if (d.heroImage?.asset?._ref) {
      urls.push({
        loc: `${BASE_URL}/destinations/${d.slug.current}`,
        image: [{ loc: urlFor(d.heroImage.asset._ref).url() }],
      });
    }
  }

  for (const b of guides) {
    if (b.mainImage?.asset?._ref) {
      urls.push({
        loc: `${BASE_URL}/guides/${b.slug.current}`,
        image: [{ loc: urlFor(b.mainImage.asset._ref).url() }],
      });
    }
  }

  return Response.json(urls);
}
