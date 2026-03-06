import { NextResponse } from "next/server";
import type { VersionInfo } from "../../../../../types";

// Bump these numbers when you update route/phrase data
const VERSION: VersionInfo = {
  routes: 1,
  phrases: 1,
  emergency: 1,
  app: "1.0.0",
};

export async function GET() {
  return NextResponse.json(VERSION, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
