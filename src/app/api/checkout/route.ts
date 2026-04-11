import { NextResponse } from "next/server";

/**
 * Gumroad checkout — simple redirect to the product page.
 * Gumroad handles all auth, payment, subscription logic.
 * On purchase, user is redirected back to /pro?success=true via Gumroad settings.
 */
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
