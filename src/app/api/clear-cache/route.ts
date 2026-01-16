import { clearCache } from "@/sanity/lib/redis-cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

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
