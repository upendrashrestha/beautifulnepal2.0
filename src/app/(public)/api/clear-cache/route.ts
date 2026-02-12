import { clearCache } from "@/sanity/lib/redis-cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const keys: string[] = body.keys || [];

    // If nothing selected → clear everything
    if (!keys.length) {
      await clearCache(undefined);
    } else {
      // Clear each selected key
      await Promise.all(keys.map((key) => clearCache(key)));
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Failed to clear cache:", error);

    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
