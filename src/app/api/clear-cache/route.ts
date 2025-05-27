import { clearCache } from "@/sanity/lib/redis-cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    const secret = process.env.NEXT_PUBLIC_ADMIN_CACHE_SECRET;

    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const key = body.key?.trim();

    await clearCache(key || undefined);

    return NextResponse.json(
      {
        message: "success",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Clear cache API error:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
