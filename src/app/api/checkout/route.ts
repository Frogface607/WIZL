import { NextResponse } from "next/server";

/**
 * Gumroad checkout — simple redirect to the product page.
 * Gumroad handles all auth, payment, subscription logic.
 * On purchase, user is redirected back to /pro?success=true via Gumroad settings.
 *
 * NOTE: During static export (output: 'export'), this API route is not included
 * in the bundle. Capacitor apps must call this endpoint at runtime via https://wizl.space/api/checkout
 */
// API routes are excluded from the Capacitor static export at runtime.
// force-static satisfies Next.js 16 output:'export' requirement.
export const dynamic = "force-static";

const GUMROAD_URL = "https://wizlspace.gumroad.com/l/wizlpro";

export async function POST() {
  return NextResponse.json({
    url: GUMROAD_URL,
    provider: "gumroad",
  });
}

export async function GET() {
  return NextResponse.json({
    url: GUMROAD_URL,
    provider: "gumroad",
  });
}
