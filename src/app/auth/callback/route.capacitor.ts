import { NextResponse } from "next/server";

// Capacitor static export stub for the auth callback route.
// OAuth code exchange runs only on the web server (wizl.space/auth/callback).
// This stub satisfies Next.js 16 output:'export' — no dynamic request values used.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ ok: false, reason: "not-available-in-app" }, { status: 404 });
}
