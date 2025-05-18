import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim() === "") {
    return NextResponse.json({ posts: [], destinations: [], categories: [] });
  }

  const query = `
    {
      "posts": *[_type == "post" && title match $q]{
        _id,
        title,
        slug,
        "type": "blog"
      },
      "destinations": *[_type == "destination" && name match $q]{
        _id,
        name,
        slug,
        "type": "destinations"
      },
      "categories": *[_type == "category" && title match $q]{
        _id,
        title,
        slug,
        "type": "categories"
      }
    }
  `;

  const results = await client.fetch(query, { q: `*${q}*` });

  return NextResponse.json(results);
}
