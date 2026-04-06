import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, locale } = body as { email?: string; locale?: string };

    const checkout = await createCheckout(email, locale);

    return NextResponse.json(checkout);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
