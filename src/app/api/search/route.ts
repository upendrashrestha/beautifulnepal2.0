import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim() === "") {
    return NextResponse.json({
      posts: [],
      destinations: [],
      categories: [],
      guides: [],
      events: [],
    });
  }

  const query = `
    {
      "posts": *[_type == "post" && title match $q]{
        _id,
        title,
        slug,
        "type": "blogs"
      },
      "destinations": *[_type == "destination" && name match $q]{
        _id,
        name,
        slug,
        "type": "destinations"
      },
      "guides": *[_type == "guide" && title match $q]{
        _id,
        title,
        slug,
        "type": "guides"
      },
      "categories": *[_type == "category" && title match $q]{
        _id,
        title,
        slug,
        "type": "categories"
      },
      "events":*[_type == "event" && title match $q || location match $q || organizerName match $q || eventDate match $q]{
      _id,
      title,
      slug,
      "type":"whats-happening"
      }
    }
  `;

  const results = await client.fetch(query, { q: `*${q}*` });

  return NextResponse.json(results);
}
