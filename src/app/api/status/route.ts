import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/status";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(getSnapshot(), {
    headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" },
  });
}
